import { Router } from "express";
import { getActivitiesByDay, createActivity, getActivityById, editActivity, deleteActivity } from "./activity.controller.js";
import { checkAuth } from "../auth/auth.middlewares.js";
import { checkActivityOwner } from "./activity.middlewares.js";

export const activityRoutes = Router();

activityRoutes.get("/day/:dayId", getActivitiesByDay);

activityRoutes.get("/:id", getActivityById);

activityRoutes.post("/:dayId", createActivity);

activityRoutes.put("/:id", checkAuth, checkActivityOwner, editActivity);

activityRoutes.delete("/:id", checkAuth, checkActivityOwner, deleteActivity);
