import { Request, Response } from "express";
import { Trip } from "../trips.model.js";
import { Notification } from "../../notifications/notifications.model.js";
import { sendError, sendSuccess } from "../../../utils/response.utils.js";

export const joinTrip = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return sendError(res, "Usuario no autenticado", 401);
        }

        const trip = await Trip.findById(id);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        if (trip.owner.toString() === userId.toString()) {
            return sendError(res, "Ya eres el organizador de este viaje", 400);
        }

        const isMember = trip.members.some((member) => member.toString() === userId.toString());

        if (isMember) {
            return sendError(res, "Ya formas parte de este viaje", 400);
        }

        if (trip.maxMembers && trip.members.length + 1 >= trip.maxMembers) {
            return sendError(res, "El viaje ya está completo", 400);
        }

        trip.members.push(userId);

        await trip.save();

        try {
            await Notification.create({
                recipient: trip.owner,
                sender: userId,
                type: "member_joined",
                targetModel: "trips",
                targetId: trip._id,
                trip: trip._id,
                message: "Se ha unido a tu viaje",
            });
        } catch (notificationError) {
            console.error("Error creando notificación de nuevo miembro:", notificationError);
        }

        return sendSuccess(res, trip, "Te has unido al viaje");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const leaveTrip = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?._id || (req as any).user?.id;

        if (!userId) {
            return sendError(res, "Usuario no autenticado", 401);
        }

        const trip = await Trip.findById(id);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        if (trip.owner.toString() === userId.toString()) {
            return sendError(res, "El organizador no puede abandonar el viaje", 400);
        }

        const isMember = trip.members.some((member) => member.toString() === userId.toString());

        if (!isMember) {
            return sendError(res, "No formas parte de este viaje", 400);
        }

        trip.members = trip.members.filter((member) => member.toString() !== userId.toString());

        await trip.save();

        try {
            await Notification.create({
                recipient: trip.owner,
                sender: userId,
                type: "member_left",
                targetModel: "trips",
                targetId: trip._id,
                trip: trip._id,
                message: "Ha abandonado tu viaje",
            });
        } catch (notificationError) {
            console.error("Error creando notificación de miembro que abandona:", notificationError);
        }

        return sendSuccess(res, trip, "Has abandonado el viaje");
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
