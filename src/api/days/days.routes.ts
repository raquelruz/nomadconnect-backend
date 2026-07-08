import { Router } from "express";
import { getDaysByItinerary, createDay, editDay, deleteDay } from "./days.controller.js";

export const dayRoutes = Router();

dayRoutes.get("/:itineraryId", getDaysByItinerary);

dayRoutes.post("/", createDay);

dayRoutes.put("/:id", editDay);

dayRoutes.delete("/:id", deleteDay);
