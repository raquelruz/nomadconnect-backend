import { NextFunction, Request, Response } from "express";
import { Trip } from "./trips.model.js";
import { TripType } from "./trips.types.js";
import { sendError } from "../../utils/response.utils.js";

interface CustomRequestTrips extends Request {
    requestInfo?: {
        timestamp: string;
        method: string;
        url: string;
    };
    user?: any;
}

export const validateTrip = (req: CustomRequestTrips, res: Response, next: NextFunction) => {
    const { title, country, city, startDate, endDate } = req.body as TripType;

    if (!req.user?.id) {
        return sendError(res, "No se ha podido identificar quién organiza este viaje", 401);
    }

    if (!title || title.length < 3) {
        return sendError(res, "El título del viaje debe contener al menos 3 caracteres", 400);
    }

    if (!country) {
        return sendError(res, "Debes seleccionar un país de destino", 400);
    }

    if (!city) {
        return sendError(res, "Debes seleccionar una ciudad de destino", 400);
    }

    if (!startDate) {
        return sendError(res, "Debes indicar la fecha de inicio del viaje", 400);
    }

    if (!endDate) {
        return sendError(res, "Debes indicar la fecha final del viaje", 400);
    }

    if (new Date(startDate) > new Date(endDate)) {
        return sendError(res, "La fecha de inicio debe ser anterior a la fecha de final", 400);
    }

    return next();
};

export const checkTripOwner = async (req: CustomRequestTrips, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const trip = await Trip.findById(id);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        if (trip.owner.toString() !== req.user?.id) {
            return sendError(res, "No tienes permisos para modificar este viaje", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
