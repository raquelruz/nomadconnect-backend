import { Request, Response } from "express";
import { Day } from "./days.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getDaysByItinerary = async (req: Request, res: Response) => {
    try {
        const { itineraryId } = req.params;

        const days = await Day.find({ itineraryId })
            .populate("itineraryId", "title description")
            .populate("activities")   
            .sort("order");

        return sendSuccess(res, days);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createDay = async (req: Request, res: Response) => {
    try {
        const newDay = await Day.create(req.body);

        return sendSuccess(res, newDay, "Día creado", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editDay = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const day = await Day.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!day) {
            return sendError(res, "Día no encontrado", 404);
        }

        return sendSuccess(res, day);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteDay = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const day = await Day.findByIdAndDelete(id);

        if (!day) {
            return sendError(res, "Día no encontrado", 404);
        }

        return sendSuccess(res, day);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};