import { NextFunction, Request, Response } from "express";
import { Day } from "./days.model.js";
import { Itinerary } from "../itinerary/itinerary.model.js";
import { Trip } from "../trips/trips.model.js";
import { sendError } from "../../utils/response.utils.js";

interface CustomRequestDays extends Request {
    user?: any;
}

export const checkDayOwner = async (req: CustomRequestDays, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const day = await Day.findById(id);

        if (!day) {
            return sendError(res, "Día no encontrado", 404);
        }

        const itinerary = await Itinerary.findById(day.itineraryId);

        if (!itinerary) {
            return sendError(res, "Itinerario no encontrado", 404);
        }

        const trip = await Trip.findById(itinerary.tripId);

        if (!trip) {
            return sendError(res, "Viaje asociado no encontrado", 404);
        }

        if (trip.owner.toString() !== req.user?.id) {
            return sendError(res, "No tienes permisos para modificar este día", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
