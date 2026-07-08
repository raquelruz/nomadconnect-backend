import { Router } from "express";
import {
    getActivitiesByDay,
    createActivity,
    getActivityById,
    editActivity,
    deleteActivity,
} from "./activity.controller.js";

export const activityRoutes = Router();

activityRoutes.get("/day/:dayId", getActivitiesByDay);

activityRoutes.get("/:id", getActivityById);

activityRoutes.post("/:dayId", createActivity);

activityRoutes.put("/:id", editActivity);

activityRoutes.delete("/:id", deleteActivity);
