import { Router } from "express";
import * as authController from "./auth.controller.js";
import { checkAuth } from "./auth.middlewares.js";

export const authRoutes: Router = Router();

// Rutas públicas
authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);

// Cambiar la propia contraseña (requiere estar autenticado)
authRoutes.patch("/change-password", checkAuth, authController.changePassword);
