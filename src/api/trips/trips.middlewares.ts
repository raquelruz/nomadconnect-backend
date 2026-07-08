import { NextFunction, Request, Response } from "express";
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

    // Validar que exista el usuario autenticado
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