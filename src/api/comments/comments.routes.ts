import { Router } from "express";
import {
    createComment,
    deleteComment,
    editComment,
    getCommentsByActivity,
    getCommentsByTrip,
} from "./comments.controller.js";

import { checkAuth } from "../auth/auth.middlewares.js";

export const commentRoutes: Router = Router();

commentRoutes.get("/trip/:tripId", getCommentsByTrip);

commentRoutes.get("/activities/:activityId", getCommentsByActivity);

commentRoutes.post("/", checkAuth, createComment);

commentRoutes.put("/:id", checkAuth, editComment);

commentRoutes.delete("/:id", checkAuth, deleteComment);
