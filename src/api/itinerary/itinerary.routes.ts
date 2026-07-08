import { Router } from "express";
import { createItinerary, deleteItinerary, editItinerary, getItinerariesByTrip } from "./itinerary.controller.js";

export const itineraryRoutes = Router();

itineraryRoutes.get("/:tripId", getItinerariesByTrip);

itineraryRoutes.post("/:tripId", createItinerary);

itineraryRoutes.put("/:id", editItinerary);

itineraryRoutes.delete("/:id", deleteItinerary);