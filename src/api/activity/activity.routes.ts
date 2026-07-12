import { Router } from "express";
import { getActivitiesByDay, createActivity, getActivityById, editActivity, deleteActivity } from "./activity.controller.js";
import { checkAuth } from "../auth/auth.middlewares.js";
import { checkActivityOwner } from "./activity.middlewares.js";
import { uploadAvatar, uploadTripImage } from "../../config/cloudinary.js";

export const activityRoutes = Router();

activityRoutes.get("/day/:dayId", getActivitiesByDay);

activityRoutes.get("/:id", getActivityById);

activityRoutes.post("/:dayId", checkAuth, uploadTripImage.array("images, 5"), createActivity);

activityRoutes.put("/:id", checkAuth, checkActivityOwner, uploadTripImage.array("images, 5"), editActivity);

activityRoutes.delete("/:id", checkAuth, checkActivityOwner, deleteActivity);
