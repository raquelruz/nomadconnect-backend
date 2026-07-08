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
                populate: { path: "author", select: "username avatar" },
            });

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
                populate: { path: "author", select: "username avatar" },
            });

        return sendSuccess(res, comments);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
export const createComment = async (req: Request, res: Response) => {
    try {
        const newComment = await Comment.create(req.body);

        // TRIP COMMENT
        if (newComment.targetModel === "trips") {
            const trip = await Trip.findById(newComment.targetId);

            if (trip && trip.owner.toString() !== newComment.author.toString()) {
                await Notification.create({
                    recipient: trip.owner,
                    sender: newComment.author,
                    type: "new_comment",
                    targetModel: "comments",
                    targetId: newComment._id,
                    message: "Ha comentado en tu viaje",
                    isRead: false,
                });
            }
        }

        // ACTIVITY COMMENT
        if (newComment.targetModel === "activities") {
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
        }

        return sendSuccess(res, newComment, "Comentario creado", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return sendError(res, "Comentario no encontrado", 404);
        }

        await Comment.deleteMany({ parentComment: id });

        return sendSuccess(res, comment);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
