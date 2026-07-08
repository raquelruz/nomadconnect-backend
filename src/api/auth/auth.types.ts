import { Request } from "express";
import { UserRole } from "../users/users.types.js";
import { Types } from "mongoose";

export interface AuthPayload {
    id: string | Types.ObjectId;
    email: string;
    role: UserRole;
}

// Extiende Request para incluir el usuario autenticado decodificado
export type AuthRequest = Request & { user?: AuthPayload };
