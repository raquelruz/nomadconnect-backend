import { Router } from "express";
import { createItinerary, deleteItinerary, editItinerary, getItinerariesByTrip } from "./itinerary.controller.js";
import { checkAuth } from "../auth/auth.middlewares.js";
import { checkItineraryOwner } from "./itinerary.middlewares.js";

export const itineraryRoutes = Router();

itineraryRoutes.get("/:tripId", getItinerariesByTrip);

itineraryRoutes.post("/:tripId", createItinerary);

itineraryRoutes.put("/:id", checkAuth, checkItineraryOwner, editItinerary);

itineraryRoutes.delete("/:id", checkAuth, checkItineraryOwner, deleteItinerary);
