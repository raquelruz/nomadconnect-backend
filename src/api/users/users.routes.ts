import { Router } from "express";
import { createUser, deleteAvatar, deleteUser, editUser, getAllUsers, getOneUser, updateAvatar } from "./users.controller.js";
import { uploadAvatar } from "../../config/cloudinary.js";
import { checkAuth } from "../auth/auth.middlewares.js";

export const userRoutes: Router = Router();

userRoutes.get("/", getAllUsers);

userRoutes.get("/:id", getOneUser);

userRoutes.post("/", createUser);

userRoutes.put("/:id", editUser);

userRoutes.patch("/avatar", checkAuth, uploadAvatar.single("avatar"), updateAvatar);

userRoutes.delete("/avatar", checkAuth, deleteAvatar);

userRoutes.delete("/:id", deleteUser);
