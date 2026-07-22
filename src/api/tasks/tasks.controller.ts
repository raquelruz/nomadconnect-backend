import { Request, Response } from "express";
import { Task } from "./tasks.model.js";
import { Trip } from "../trips/trips.model.js";
import { Notification } from "../notifications/notifications.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getTasksByTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;
        const tasks = await Task.find({ tripId }).populate("assignedTo", "username avatar").sort("order");

        return sendSuccess(res, tasks);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const newTask = await Task.create(req.body);

        return sendSuccess(res, newTask, "Tarea creada", 201);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const toggleTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            return sendError(res, "Tarea no encontrada", 404);
        }

        task.isCompleted = !task.isCompleted;
        await task.save();

        if (task.isCompleted && task.assignedTo) {
            try {
                const trip = await Trip.findById(task.tripId);

                if (trip?.owner && task.assignedTo.toString() !== trip.owner.toString()) {
                    await Notification.create({
                        recipient: trip.owner,
                        sender: task.assignedTo,
                        type: "task_completed",
                        targetModel: "tasks",
                        targetId: task._id,
                        trip: task.tripId,
                        message: "Ha completado una tarea",
                    });
                }
            } catch (notificationError) {
                console.error("Error creando notificación de tarea completada:", notificationError);
            }
        }

        return sendSuccess(res, task);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const editTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });

        if (!task) {
            return sendError(res, "Tarea no encontrada", 404);
        }

        return sendSuccess(res, task);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return sendError(res, "Tarea no encontrada", 404);
        }

        return sendSuccess(res, task);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
