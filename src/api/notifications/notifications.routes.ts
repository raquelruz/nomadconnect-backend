import { checkAuth } from "../auth/auth.middlewares.js"
import { Router } from "express";
import { createNotification, deleteNotification, getNotificationByUser, getUnreadCount, markAsRead } from "./notifications.controller.js";

export const notificationRoutes: Router = Router();

notificationRoutes.get("/user/:userId", checkAuth, getNotificationByUser);

notificationRoutes.get("/unread/:userId", checkAuth, getUnreadCount);

notificationRoutes.post("/", checkAuth, createNotification);

notificationRoutes.patch("/:id/read", checkAuth, markAsRead);

notificationRoutes.delete("/:id", checkAuth, deleteNotification);
