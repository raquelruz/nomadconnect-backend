import { NextFunction, Request, Response } from "express";
import { Itinerary } from "./itinerary.model.js";
import { Trip } from "../trips/trips.model.js";
import { sendError } from "../../utils/response.utils.js";

interface CustomRequestItineraries extends Request {
    user?: any;
}

export const checkItineraryOwner = async (req: CustomRequestItineraries, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return sendError(res, "Itinerario no encontrado", 404);
        }

        const trip = await Trip.findById(itinerary.tripId);

        if (!trip) {
            return sendError(res, "Viaje asociado no encontrado", 404);
        }

        if (trip.owner.toString() !== req.user?.id) {
            return sendError(res, "No tienes permisos para modificar este itinerario", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
