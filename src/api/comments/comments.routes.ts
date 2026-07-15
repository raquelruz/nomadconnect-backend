import { Router } from "express";
import { createComment, deleteComment, getCommentsByActivity, getCommentsByTrip } from "./comments.controller.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const commentRoutes: Router = Router();

commentRoutes.get("/trip/:tripId", getCommentsByTrip);

commentRoutes.get("/activities/:activityId", getCommentsByActivity);

commentRoutes.post("/", checkAuth, createComment);

commentRoutes.delete("/:id", checkAuth, deleteComment);
