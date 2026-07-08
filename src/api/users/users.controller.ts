import { Request, Response } from "express";
import { User } from "./users.model.js";
import { Trip } from "../trips/trips.model.js";
import { Task } from "../tasks/tasks.model.js";
import { Comment } from "../comments/comments.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("name username email");

        return sendSuccess(res, users);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const getOneUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return sendError(res, "Usuario no encontrado", 404);
        }

        return sendSuccess(res, user);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = await User.create(req.body);

        return sendSuccess(res, newUser, "Usuario creado", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userData = {
            ...req.body,
        };

        if (req.file) {
            userData.avatar = req.file.path;
        }

        const user = await User.findByIdAndUpdate(id, userData, {
            new: true,
        });

        if (!user) {
            return sendError(res, "Usuario no encontrado", 404);
        }

        return sendSuccess(res, user);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const updateAvatar = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return sendError(res, "No se ha enviado ninguna imagen", 400);
        }

        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return sendError(res, "No autorizado", 401);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: req.file.path },
            {
                returnDocument: "after",
            }
        );

        if (!user) {
            return sendError(res, "Usuario no encontrado", 404);
        }

        return sendSuccess(res, user, "Avatar actualizado");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return sendError(res, "Usuario no encontrado", 404);
        }

        // Cascade
        const userTrips = await Trip.find({ owner: id }).select("_id");
        const tripIds = userTrips.map((trip) => trip._id);

        await Task.deleteMany({ tripId: { $in: tripIds } });
        await Comment.deleteMany({ tripId: { $in: tripIds } });

        return sendSuccess(res, user);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
