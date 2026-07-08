import { Request, Response } from "express";
import { Notification } from "./notifications.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getNotificationByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({
            recipient: userId,
        })
            .sort({ createdAt: -1 })
            .populate("sender", "username avatar")
            .limit(50);

        return sendSuccess(res, notifications);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
        });

        return sendSuccess(res, count);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createNotification = async (req: Request, res: Response) => {
    try {
        const newNotification = await Notification.create(req.body);

        return sendSuccess(res, newNotification, "Notificación creada", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

        if (!notification) {
            return sendError(res, "Notificación no encontrada", 404);
        }

        return sendSuccess(res, notification);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return sendError(res, "Notificación no encontrada", 404);
        }

        return sendSuccess(res, notification);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
