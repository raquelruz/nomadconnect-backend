import { Router } from "express";
import { createUser, deleteUser, editUser, getAllUsers, getLogin, getOneUser, getRegister } from "./users.controller.js";

export const userRoutes: Router = Router();

// userRoutes.get("/register", getRegister);
// userRoutes.get("/login", getLogin);

userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getOneUser);
userRoutes.post("/", createUser);
userRoutes.put("/:id", editUser);
userRoutes.delete("/:id", deleteUser);