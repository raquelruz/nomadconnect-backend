import { Request, Response } from "express";
import { Update } from "./updates.model.js";
import { Trip } from "../trips/trips.model.js";
import { Notification } from "../notifications/notifications.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getUpdatesByTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;
        const updates = await Update.find({ tripId })
        .sort({ createdAt: -1 });

        return sendSuccess(res, updates);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createUpdate = async (req: Request, res: Response) => {
    try {
        const newUpdate = await Update.create(req.body);

        const trip = await Trip.findById(newUpdate.tripId).lean();
        if (trip && trip.owner.toString() !== newUpdate.userId.toString()) {
            await Notification.create({
                recipient: trip.owner,
                sender: newUpdate.userId,
                type: "new_update",
                targetModel: "updates",
                targetId: newUpdate._id,
                message: "Ha publicado una actualización en tu viaje"
            })
        };

        return sendSuccess(res, newUpdate, "Actualización creada", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
}