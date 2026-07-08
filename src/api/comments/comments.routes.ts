import { Router } from "express";
import { createComment, deleteComment, getCommentsByActivity, getCommentsByTrip } from "./comments.controller.js";

export const commentRoutes: Router = Router();

commentRoutes.get("/trip/:tripId", getCommentsByTrip);

commentRoutes.get("/activities/:activityId", getCommentsByActivity);

commentRoutes.post("/", createComment);

commentRoutes.delete("/:id", deleteComment);