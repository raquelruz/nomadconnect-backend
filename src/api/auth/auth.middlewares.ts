import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload, AuthRequest } from "./auth.types.js";
import { sendError } from "../../utils/response.utils.js";
import { User } from "../users/users.model.js";

// Portero 1: Comprueba que el usuario tenga sesión activa (Token válido)
export const checkAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Formato esperado: "Bearer TOKEN"

    if (!token) return sendError(res, "Acceso denegado, falta token", 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthPayload;
        const user = await User.findOne({ email: decoded.email }).lean();
        req.user = {...decoded, ...user}; // Inyectamos el payload decodificado en el request
        // console.log(req.user);
        return next();
    } catch {
        return sendError(res, "Token no válido o expirado", 401);
    }
};

// Portero 2: Comprueba roles. Acepta un único string o un array de strings.
export const checkRole = (rolesRequired: string | string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) return sendError(res, "Error de autenticación previa", 401);

        // Normalizamos a array para unificar la lógica
        const allowedRoles = Array.isArray(rolesRequired) ? rolesRequired : [rolesRequired];

        if (!allowedRoles.includes(user.role)) {
            return sendError(
                res,
                "Acceso prohibido: No tienes los permisos necesarios para esta acción",
                403
            );
        }

        return next();
    };
};
