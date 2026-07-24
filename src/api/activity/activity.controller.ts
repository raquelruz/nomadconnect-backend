import { Request, Response } from "express";
import { Activity } from "./activity.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";
import { Trip } from "../trips/trips.model.js";
import { Day } from "../days/days.model.js";

export const getActivitiesByDay = async (req: Request, res: Response) => {
    try {
        const { dayId } = req.params;

        const activities = await Activity.find({ dayId })
            .populate("dayId", "title date")
            // .populate("members", "username avatar")
            .populate("comments", "author text")
            .sort({ time: 1 });

        return sendSuccess(res, activities);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const getActivityById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findById(id)
            .populate("dayId", "title date")
            .populate("members", "username avatar")
            .populate("comments", "author text");

        if (!activity) {
            return sendError(res, "Actividad no encontrada", 404);
        }

        return sendSuccess(res, activity);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createActivity = async (req: Request, res: Response) => {
    try {
        const { dayId } = req.params;

        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return sendError(res, "No se ha podido identificar al usuario", 401);
        }

        const images =
            ((req.files as Express.Multer.File[]) || []).map(
                (file) => file.path
            );

        const activityData = {
            ...req.body,
            dayId,
            createdBy: userId,
            images,
        };

        const newActivity = await Activity.create(activityData);

        return sendSuccess(res, newActivity, "Actividad creada", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const updateActivitiesImages = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return sendError(res, "No se ha enviado ninguna imagen", 400);
        }

        const { id } = req.params;
        // req.file.path es la URL pública que devuelve Cloudinary.
        const day = await Day.findByIdAndUpdate(id, { image: req.file.path }, { new: true });

        if (!day) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        return sendSuccess(res, day, "Imagen actualizada");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findByIdAndUpdate(id, req.body, { new: true });

        if (!activity) {
            return sendError(res, "Actividad no encontrada", 404);
        }

        return sendSuccess(res, activity);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findByIdAndDelete(id);

        if (!activity) {
            return sendError(res, "Actividad no encontrada", 404);
        }

        return sendSuccess(res, activity);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
