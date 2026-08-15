import { NextFunction, Request, Response } from "express";
import { Trip } from "../trips.model.js";
import { areUsersBlocked } from "../../../utils/blocks.utils.js";
import { sendError } from "../../../utils/response.utils.js";

export const checkNotBlocked = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?._id || (req as any).user?.id;
        const tripId = req.params.id;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        const blocked = await areUsersBlocked(userId.toString(), trip.owner.toString());

        if (blocked) {
            return sendError(res, "No puedes realizar esta acción", 403);
        }

        next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};