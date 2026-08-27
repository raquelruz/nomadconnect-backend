import { Router } from "express";
import * as tasksController from "./tasks.controller.js";
import { checkTripMemberForTask, checkTaskMember, checkTaskOwnerOrCreator } from "./tasks.middlewares.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const taskRoutes: Router = Router();

taskRoutes.get("/trip/:tripId", tasksController.getTasksByTrip);

taskRoutes.post("/", checkAuth, checkTripMemberForTask, tasksController.createTask);

taskRoutes.patch("/:id", checkAuth, checkTaskMember, tasksController.toggleTask);

taskRoutes.put("/:id", checkAuth, checkTaskOwnerOrCreator, tasksController.editTask);

taskRoutes.delete("/:id", checkAuth, checkTaskOwnerOrCreator, tasksController.deleteTask);