import { Response, NextFunction } from "express";
import { pool } from "../../config/db.js";
import { CustomRequest } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";

export const createIssue = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, description, type } = req.body;
        if (!title || !description || !type) {
            throw new AppError(400, "Missing required fields");
        }
        if (title.length > 150) {
            throw new AppError(400, "Title cannot exceed 150 characters");
        }
        if (description.length < 20) {
            throw new AppError(400, "Description must be at least 20 characters");
        }
        if (type !== "bug" && type !== "feature_request") {
            throw new AppError(400, "Invalid type");
        }
        const reporterId = req.user?.id;
        const result = await pool.query(
            "INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING id, title, description, type, status, reporter_id, created_at, updated_at",
            [title, description, type, reporterId]
        );
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getAllIssues = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sort, type, status } = req.query;
        let queryText = "SELECT * FROM issues";
        const queryParams: any[] = [];
        const whereClauses: string[] = [];

        if (type === "bug" || type === "feature_request") {
            queryParams.push(type);
            whereClauses.push(`type = $${queryParams.length}`);
        }
        if (status === "open" || status === "in_progress" || status === "resolved") {
            queryParams.push(status);
            whereClauses.push(`status = $${queryParams.length}`);
        }
        if (whereClauses.length > 0) {
            queryText += " WHERE " + whereClauses.join(" AND ");
        }

        if (sort === "oldest") {
            queryText += " ORDER BY created_at ASC";
        } else {
            queryText += " ORDER BY created_at DESC";
        }

        const issuesResult = await pool.query(queryText, queryParams);
        const issues = issuesResult.rows;

        if (issues.length === 0) {
            res.status(200).json({ success: true, message: "Issues retrieved successfully", data: [] });
            return;
        }

        const reporterIds = Array.from(new Set(issues.map(i => i.reporter_id)));
        const usersResult = await pool.query(
            `SELECT id, name, role FROM users WHERE id IN (${reporterIds.map((_, idx) => `$${idx + 1}`).join(",")})`,
            reporterIds
        );
        const userMap = new Map(usersResult.rows.map(u => [u.id, u]));

        const data = issues.map(issue => {
            const reporter = userMap.get(issue.reporter_id) || null;
            return {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,
                reporter,
                created_at: issue.created_at,
                updated_at: issue.updated_at
            };
        });

        res.status(200).json({
            success: true,
            message: "Issues retrieved successfully",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const getSingleIssue = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);
        if (issueResult.rows.length === 0) {
            throw new AppError(404, "Issue not found");
        }
        const issue = issueResult.rows[0];
        const userResult = await pool.query("SELECT id, name, role FROM users WHERE id = $1", [issue.reporter_id]);
        const reporter = userResult.rows[0] || null;

        res.status(200).json({
            success: true,
            message: "Issue retrieved successfully",
            data: {
                id: issue.id,
                title: issue.title,
                description: issue.description,
                type: issue.type,
                status: issue.status,
                reporter,
                created_at: issue.created_at,
                updated_at: issue.updated_at
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateIssue = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, type, status } = req.body;
        const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);
        if (issueResult.rows.length === 0) {
            throw new AppError(404, "Issue not found");
        }
        const issue = issueResult.rows[0];
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (userRole === "contributor") {
            if (issue.reporter_id !== userId) {
                throw new AppError(403, "Insufficient permissions to update this issue");
            }
            if (issue.status !== "open") {
                throw new AppError(409, "Business logic conflict: Cannot edit non-open issues");
            }
            if (status !== undefined) {
                throw new AppError(403, "Contributors are not allowed to change issue status workflow");
            }
        }

        const updatedTitle = title !== undefined ? title : issue.title;
        const updatedDescription = description !== undefined ? description : issue.description;
        const updatedType = type !== undefined ? type : issue.type;
        const updatedStatus = status !== undefined ? status : issue.status;

        if (updatedTitle.length > 150) {
            throw new AppError(400, "Title cannot exceed 150 characters");
        }
        if (updatedDescription.length < 20) {
            throw new AppError(400, "Description must be at least 20 characters");
        }
        if (updatedType !== "bug" && updatedType !== "feature_request") {
            throw new AppError(400, "Invalid type");
        }
        if (updatedStatus !== "open" && updatedStatus !== "in_progress" && updatedStatus !== "resolved") {
            throw new AppError(400, "Invalid status");
        }

        const result = await pool.query(
            "UPDATE issues SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, title, description, type, status, reporter_id, created_at, updated_at",
            [updatedTitle, updatedDescription, updatedType, updatedStatus, id]
        );

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
};

export const deleteIssue = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const checkResult = await pool.query("SELECT id FROM issues WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            throw new AppError(404, "Issue not found");
        }
        await pool.query("DELETE FROM issues WHERE id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Issue deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
