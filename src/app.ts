import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import issueRoutes from "./modules/issues/issues.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { AppError } from "./utils/AppError.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.use((req, res, next) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorMiddleware);

export default app;
