import { Router } from "express";
import * as tasksController from "./tasks.controller.js";
import { checkTripMemberForTask, checkTaskMember, checkTaskOwnerOrAssignee } from "./tasks.middlewares.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const taskRoutes: Router = Router();

taskRoutes.get("/trip/:tripId", tasksController.getTasksByTrip);

taskRoutes.post("/", checkAuth, checkTripMemberForTask, tasksController.createTask);

taskRoutes.patch("/:id", checkAuth, checkTaskMember, tasksController.toggleTask);

taskRoutes.put("/:id", checkAuth, checkTaskOwnerOrAssignee, tasksController.editTask);

taskRoutes.delete("/:id", checkAuth, checkTaskOwnerOrAssignee, tasksController.deleteTask);