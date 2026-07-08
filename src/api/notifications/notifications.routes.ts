import { Router } from "express";
import { createNotification, deleteNotification, getNotificationByUser, getUnreadCount, markAsRead } from "./notifications.controller.js";

export const notificationRoutes: Router = Router();

notificationRoutes.get("/user/:userId", getNotificationByUser);

notificationRoutes.get("/unread/:userId", getUnreadCount);

notificationRoutes.post("/", createNotification);

notificationRoutes.patch("/:id/read", markAsRead);

notificationRoutes.delete("/:id", deleteNotification);
