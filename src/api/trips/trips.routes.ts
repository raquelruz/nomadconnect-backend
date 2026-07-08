
import { Router } from "express";
import {  getTrips, getTripsByUser, getMyTrips,  getOneTrip, createTrip, editTrip, deleteTrip, updateTripImage } from "./trips.controller.js";
import { validateTrip } from "./trips.middlewares.js";
import { uploadTripImage } from "../../config/cloudinary.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const tripRoutes: Router = Router();

tripRoutes.get("/", getTrips);

tripRoutes.get("/user/:userId", getTripsByUser);

tripRoutes.get("/my-trips/:userId", getMyTrips);

tripRoutes.get("/:id", getOneTrip);

tripRoutes.post("/", checkAuth, [uploadTripImage.single("image"), validateTrip], createTrip);

tripRoutes.put("/:id", editTrip);

tripRoutes.patch("/:id/image", uploadTripImage.single("image"), updateTripImage);

tripRoutes.delete("/:id", deleteTrip);