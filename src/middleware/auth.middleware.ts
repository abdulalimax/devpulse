import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, JwtPayload } from "../types/index.js";
import { AppError } from "../utils/AppError.js";

export const protect = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError(401, "Missing token");
    }
    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        next(new AppError(401, "Invalid or expired token"));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError(403, "Insufficient permissions");
        }
        next();
    };
};
