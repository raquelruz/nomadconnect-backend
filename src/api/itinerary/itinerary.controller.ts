import { Request, Response } from "express";
import { Itinerary } from "./itinerary.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getItinerariesByTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        const itineraries = await Itinerary.find({ tripId }).populate("days");

        return sendSuccess(res, itineraries);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createItinerary = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        const itinerary = await Itinerary.create({
            tripId,
            ...req.body,
        });

        return sendSuccess(res, itinerary, "Itinerario creado", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editItinerary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate("days");

        if (!itinerary) {
            return sendError(res, "Itinerario no encontrado", 404);
        }

        return sendSuccess(res, itinerary);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteItinerary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const itinerary = await Itinerary.findByIdAndDelete(id);

        if (!itinerary) {
            return sendError(res, "Itinerario no encontrado", 404);
        }

        return sendSuccess(res, itinerary);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};