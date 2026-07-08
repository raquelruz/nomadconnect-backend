import { Router } from "express";
import { createUpdate, getUpdatesByTrip } from "./updates.controller.js";

export const updateRoutes: Router = Router();

updateRoutes.get("/trip/:tripId", getUpdatesByTrip);

updateRoutes.post("/", createUpdate);



