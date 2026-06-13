import { Router } from "express";
import { createIssue, getAllIssues, getSingleIssue, updateIssue, deleteIssue } from "./issues.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createIssue);
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);
router.patch("/:id", protect, updateIssue);
router.delete("/:id", protect, authorize("maintainer"), deleteIssue);

export default router;
