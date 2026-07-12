import { Request, Response } from "express";
import { Activity } from "./activity.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

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

        const images = req.files ? (req.files as Express.Multer.File[]).map((file) => file.path) : [];

        const newActivity = await Activity.create({
            ...req.body,
            dayId,
            images,
        });

        return sendSuccess(res, newActivity, "Actividad creada", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editActivity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findById(id);

        if (!activity) {
            return sendError(res, "Actividad no encontrada", 404);
        }

        const images = req.files ? (req.files as Express.Multer.File[]).map((file) => file.path) : [];

        activity.set({
            ...req.body,
            images: [...activity.images, ...images],
        });

        await activity.save();

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
