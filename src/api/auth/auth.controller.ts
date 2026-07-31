import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../users/users.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";
import { AuthRequest } from "./auth.types.js";

const SALT_NUMBER = 10;

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, "Correo electrónico y contraseña son obligatorios", 400);
        }

        // Encriptamos la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, SALT_NUMBER);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        if (!process.env.JWT_SECRET) {
            return sendError(res, "Error al crear la cuenta", 500);
        }

        // Generamos token también en el registro para poder hacer auto-login
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, bio: newUser.bio },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return sendSuccess(
            res,
            {
                token,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    name: newUser.name,
                    surname: newUser.surname,
                    avatar: newUser.avatar,
                    likedTrips: newUser.likedTrips,
                },
            },
            "Cuenta creada correctamente",
            201
        );
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, "Email y contraseña son obligatorios", 400);
        }

        // El password tiene select:false en el modelo, lo pedimos explícitamente
        const user = await User.findOne({ email }).select("+password");

        const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !isPasswordValid) {
            return sendError(
                res,
                "Credenciales inválidas. Si no recuerdas tu contraseña, pulsa en 'Recuperar contraseña' ",
                401
            );
        }

        if (!process.env.JWT_SECRET) {
            return sendError(res, "Error al iniciar sesión", 500);
        }

        // Guardamos id, email y rol en el payload del JWT (la "pulsera VIP")
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        return sendSuccess(
            res,
            {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    surname: user.surname,
                    avatar: user.avatar,
                    likedTrips: user.likedTrips,
                },
            },
            "Has iniciado sesión correctamente"
        );
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const authUser = req.user;
        if (!authUser) return sendError(res, "No autenticado", 401);

        const { currentPassword, newPassword, repeatNewPassword } = req.body;

        if (!currentPassword || !newPassword || !repeatNewPassword) {
            return sendError(res, "Debes completar todos los campos", 400);
        }

        if (newPassword !== repeatNewPassword) {
            return sendError(res, "Las nuevas contraseñas no coinciden", 400);
        }

        if (newPassword.length < 8) {
            return sendError(res, "La nueva contraseña debe tener al menos 8 caracteres", 400);
        }

        if (newPassword === currentPassword) {
            return sendError(res, "La nueva contraseña debe ser distinta de la actual", 400);
        }

        const user = await User.findById(authUser.id).select("+password");
        if (!user) return sendError(res, "Usuario no encontrado", 404);

        const isCurrentValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentValid) {
            return sendError(res, "La contraseña actual no es correcta", 400);
        }
        
        user.password = await bcrypt.hash(newPassword, SALT_NUMBER);
        await user.save();

        return sendSuccess(res, null, "Contraseña actualizada correctamente");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
