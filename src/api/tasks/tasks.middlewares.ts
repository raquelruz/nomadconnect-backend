import { NextFunction, Request, Response } from "express";
import { Trip } from "../trips/trips.model.js";
import { Task } from "./tasks.model.js";
import { sendError } from "../../utils/response.utils.js";

interface CustomRequestTasks extends Request {
    user?: any;
}

const isTripMember = (trip: any, userId?: string) => {
    if (!userId) return false;
    if (trip.owner.toString() === userId) return true;
    return (trip.members || []).some((memberId: any) => memberId.toString() === userId);
};

export const checkTripMemberForTask = async (req: CustomRequestTasks, res: Response, next: NextFunction) => {
    try {
        const { tripId } = req.body;

        if (!req.user?.id) {
            return sendError(res, "No se ha podido identificar al usuario", 401);
        }

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        if (!isTripMember(trip, req.user.id)) {
            return sendError(res, "No perteneces a este viaje", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const checkTaskMember = async (req: CustomRequestTasks, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return sendError(res, "Tarea no encontrada", 404);
        }

        const trip = await Trip.findById(task.tripId);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        if (!isTripMember(trip, req.user?.id)) {
            return sendError(res, "No perteneces a este viaje", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const checkTaskOwnerOrAssignee = async (req: CustomRequestTasks, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);

        if (!task) {
            return sendError(res, "Tarea no encontrada", 404);
        }

        const trip = await Trip.findById(task.tripId);

        if (!trip) {
            return sendError(res, "Viaje no encontrado", 404);
        }

        const isOwner = trip.owner.toString() === req.user?.id;
        const isAssignee = task.assignedTo?.toString() === req.user?.id;

        if (!isOwner && !isAssignee) {
            return sendError(res, "No tienes permisos para modificar esta tarea", 403);
        }

        return next();
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
