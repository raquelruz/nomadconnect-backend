import { NextFunction, Request, Response } from "express";
import { sendError } from "./response.utils.js";

interface HTTPError extends Error {
    statusCode?: number;
}

// Middleware para rutas no encontradas (404)
// Se ejecuta cuando ninguna ruta previa ha respondido y delega al manejador global.
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    const error: HTTPError = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

// Middleware global de errores. Debe declarar los 4 parámetros para que 
// Express lo identifique como manejador de errores, aunque `next` no se use.
// eslint-disable-nextline @typescript-eslint/no-unused-vars
export const errorHandler = (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const code = err.statusCode || 500;
    const message = err.message || "Algo salió mal en el servidor";

    console.error(`Error detectado: ${message}`);

    return sendError(res, message, code);
}