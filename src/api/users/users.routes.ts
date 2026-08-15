import { Router } from "express";
import { blockUser, createUser, deleteAvatar, deleteUser, editUser, getAllUsers, getBlockedUsers, getOneUser, unblockUser, updateAvatar } from "./users.controller.js";
import { uploadAvatar } from "../../config/cloudinary.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const userRoutes: Router = Router();

userRoutes.get("/", getAllUsers);

userRoutes.get("/blocked", checkAuth, getBlockedUsers);

userRoutes.get("/:id", checkAuth, getOneUser);

userRoutes.post("/", createUser);

userRoutes.post("/:id/blocked", checkAuth, blockUser);

userRoutes.put("/:id", checkAuth, editUser);

userRoutes.patch("/avatar", checkAuth, uploadAvatar.single("avatar"), updateAvatar);

userRoutes.delete("/avatar", checkAuth, deleteAvatar);

userRoutes.delete("/:id", checkAuth, deleteUser);

userRoutes.delete("/:id/blocked", checkAuth, unblockUser);