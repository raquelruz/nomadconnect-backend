import { Router } from "express";
import {
    getTrips,
    getTripsByUser,
    getMyTrips,
    getOneTrip,
    createTrip,
    editTrip,
    deleteTrip,
    updateTripImage,
    toggleLikeTrip,
} from "./trips.controller.js";

import { joinTrip, leaveTrip } from "./members/members.controller.js";

import { validateTrip } from "./trips.middlewares.js";
import { uploadTripImage } from "../../config/cloudinary.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const tripRoutes: Router = Router();

// Públicas
tripRoutes.get("/", getTrips);
tripRoutes.get("/user/:userId", getTripsByUser);
tripRoutes.get("/:id", getOneTrip);

// Privadas
tripRoutes.get("/my-trips/:userId", checkAuth, getMyTrips);

tripRoutes.post("/", checkAuth, [uploadTripImage.single("image"), validateTrip], createTrip);


tripRoutes.put("/:id", checkAuth, editTrip);

tripRoutes.patch("/:id/image", checkAuth, uploadTripImage.single("image"), updateTripImage);

tripRoutes.delete("/:id", checkAuth, deleteTrip);

// Miembros
tripRoutes.post("/:id/join", checkAuth, joinTrip);

tripRoutes.delete("/:id/leave", checkAuth, leaveTrip);


// Likes
tripRoutes.post("/:id/like", checkAuth, toggleLikeTrip);