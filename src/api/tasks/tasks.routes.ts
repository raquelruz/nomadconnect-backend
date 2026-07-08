import { Router } from "express";
import * as tasksController from "./tasks.controller.js";

export const taskRoutes: Router = Router();

taskRoutes.get("/trip/:tripId", tasksController.getTasksByTrip);

taskRoutes.post("/", tasksController.createTask);

taskRoutes.patch("/:id", tasksController.toggleTask);

taskRoutes.put("/:id", tasksController.editTask);

taskRoutes.delete("/:id", tasksController.deleteTask);
