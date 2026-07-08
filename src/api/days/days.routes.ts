import { Router } from "express";
import { getDaysByItinerary, createDay, editDay, deleteDay } from "./days.controller.js";
import { checkAuth } from "../auth/auth.middlewares.js";
import { checkDayOwner } from "./days.middlewares.js";

export const dayRoutes = Router();

dayRoutes.get("/:itineraryId", getDaysByItinerary);

dayRoutes.post("/:itineraryId", createDay);

dayRoutes.put("/:id", checkAuth, checkDayOwner, editDay);

dayRoutes.delete("/:id", checkAuth, checkDayOwner, deleteDay);
