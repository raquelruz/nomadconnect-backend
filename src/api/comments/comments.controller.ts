import { Request, Response } from "express";
import { Comment } from "./comments.model.js";
import { Trip } from "../trips/trips.model.js";
import { Activity } from "../activity/activity.model.js";
import { Notification } from "../notifications/notifications.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getCommentsByTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        const comments = await Comment.find({
            targetModel: "trips",
            targetId: tripId,
        })
            .populate("author", "username avatar")
            .populate({
                path: "parentComment",
                populate: {
                    path: "author",
                    select: "username avatar",
                },
            })
            .sort({ createdAt: -1 });

        return sendSuccess(res, comments);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const getCommentsByActivity = async (req: Request, res: Response) => {
    try {
        const { activityId } = req.params;

        const comments = await Comment.find({
            targetModel: "activities",
            targetId: activityId,
        })
            .populate("author", "username avatar")
            .populate({
                path: "parentComment",
                populate: {
                    path: "author",
                    select: "username avatar",
                },
            })
            .sort({ createdAt: -1 });

        return sendSuccess(res, comments);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return sendError(res, "Usuario no autenticado", 401);
        }

        const newComment = await Comment.create({
            ...req.body,
            author: userId,
        });

        // NOTIFICACIÓN EN VIAJE
        if (newComment.targetModel === "trips") {
            try {
                const trip = await Trip.findById(newComment.targetId);

                if (trip && trip.owner.toString() !== newComment.author.toString()) {
                    await Notification.create({
                        recipient: trip.owner,
                        sender: newComment.author,
                        type: "new_comment",
                        targetModel: "comments",
                        targetId: newComment._id,
                        trip: newComment.targetId,
                        message: "Ha comentado en tu viaje",
                        isRead: false,
                    });
                }
            } catch (notificationError) {
                console.error("Error creando notificación de comentario en viaje:", notificationError);
            }
        }

        // NOTIFICACIÓN EN ACTIVIDAD
        if (newComment.targetModel === "activities") {
            try {
                const activity = await Activity.findById(newComment.targetId);

                if (activity && activity.createdBy.toString() !== newComment.author.toString()) {
                    await Notification.create({
                        recipient: activity.createdBy,
                        sender: newComment.author,
                        type: "new_comment",
                        targetModel: "comments",
                        targetId: newComment._id,
                        message: "Ha comentado en tu actividad",
                        isRead: false,
                    });
                }
            } catch (notificationError) {
                console.error("Error creando notificación de comentario en actividad:", notificationError);
            }
        }

        return sendSuccess(res, newComment, "Comentario creado", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, "Comentario no encontrado", 404);
        }

        const isAuthor = comment.author.toString() === userId.toString();

        if (!isAuthor) {
            return sendError(res, "No tienes permiso para editar este comentario", 403);
        }

        comment.text = req.body.text;

        await comment.save();

        return sendSuccess(res, comment, "Comentario actualizado");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return sendError(res, "Comentario no encontrado", 404);
        }

        const isAuthor = comment.author.toString() === userId.toString();

        let isTripOwner = false;

        if (comment.targetModel === "trips") {
            const trip = await Trip.findById(comment.targetId);

            if (trip) {
                isTripOwner = trip.owner.toString() === userId.toString();
            }
        }

        if (!isAuthor && !isTripOwner) {
            return sendError(res, "No tienes permiso para eliminar este comentario", 403);
        }

        await Comment.deleteMany({
            parentComment: id,
        });

        await comment.deleteOne();

        return sendSuccess(res, comment, "Comentario eliminado");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
