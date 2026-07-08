import { Response } from "express";

export const sendSuccess = (res: Response, data: unknown, message = "Operación exitosa", code = 200) => {
    return res.status(code).json({
        status: "success",
        message,
        data,
    });
};

export const sendError = (res: Response, message = "Error interno", code = 500) => {
    return res.status(code).json({
        status: "error",
        message,
        code,
    });
};