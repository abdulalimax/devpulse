import { Request } from "express";

export interface JwtPayload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: "contributor" | "maintainer";
    created_at: Date;
    updated_at: Date;
}

export interface CustomRequest extends Request {
    user?: JwtPayload;
}
