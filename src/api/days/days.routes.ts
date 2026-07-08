import { Router } from "express";
import { getDaysByItinerary, createDay, editDay, deleteDay } from "./days.controller.js";

export const dayRoutes = Router();

dayRoutes.get("/:itineraryId", getDaysByItinerary);

dayRoutes.post("/:itineraryId", createDay);

dayRoutes.put("/:itineraryId", editDay);

dayRoutes.delete(":itineraryId", deleteDay);
