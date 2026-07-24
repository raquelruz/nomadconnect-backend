import { Response } from "express";
import { AuthRequest } from "../auth/auth.types.js";
import { Notification } from "./notifications.model.js";
import { sendError, sendSuccess } from "../../utils/response.utils.js";

export const getNotificationByUser = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const requesterId = req.user?.id;

        // checkAuth ya garantiza que hay sesión, pero seguimos comprobando
        // que el userId de la URL coincide con quien hace la petición:
        // sin esto, cualquier usuario autenticado podía leer las
        // notificaciones de cualquier otro con solo cambiar el userId.
        if (!requesterId || requesterId.toString() !== userId) {
            return sendError(res, "No tienes permiso para ver estas notificaciones", 403);
        }

        const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 15, 1), 50);
        const unreadOnly = req.query.unreadOnly === "true";

        const filter: Record<string, unknown> = { recipient: userId };
        if (unreadOnly) filter.isRead = false;

        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .populate("sender", "username avatar")
                .skip((page - 1) * limit)
                .limit(limit),
            Notification.countDocuments(filter),
        ]);

        return sendSuccess(res, {
            notifications,
            page,
            hasMore: page * limit < total,
            total,
        });
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const requesterId = req.user?.id;

        if (!requesterId || requesterId.toString() !== userId) {
            return sendError(res, "No tienes permiso para ver esta información", 403);
        }

        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
        });

        return sendSuccess(res, count);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

// OJO: este endpoint, tal como estaba, dejaba crear una notificación con
// cualquier recipient/sender/mensaje que el cliente quisiera mandar en el body
// (podías "notificar" en nombre de otro usuario). Las notificaciones que sí
// necesitas (comentarios, tareas, updates, join/leave) ya se crean desde sus
// propios controladores con Notification.create(...) directamente — ese es
// el único sitio donde debería crearse una notificación.
//
// Si de verdad necesitas este endpoint como API pública (por ejemplo, para
// que un admin notifique a un usuario manualmente), como mínimo:
// - el sender debe salir de req.user, nunca del body
// - hay que validar que recipient exista y sea un usuario real
// - probablemente debería estar detrás de checkRole("admin"), no abierto a cualquiera
//
// Lo dejo aquí bloqueado por defecto; descomenta y ajusta si realmente lo usas.
export const createNotification = async (req: AuthRequest, res: Response) => {
    return sendError(res, "Este endpoint no acepta creación directa de notificaciones", 403);

    // const senderId = req.user?._id;
    // const newNotification = await Notification.create({
    //     ...req.body,
    //     sender: senderId, // nunca confiar en req.body.sender
    // });
    // return sendSuccess(res, newNotification, "Notificación creada", 201);
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const requesterId = req.user?.id;

        const notification = await Notification.findById(id);

        if (!notification) {
            return sendError(res, "Notificación no encontrada", 404);
        }

        // Sin esto, cualquier usuario autenticado podía marcar como leída
        // una notificación ajena con solo conocer/adivinar su id.
        if (!requesterId || notification.recipient.toString() !== requesterId.toString()) {
            return sendError(res, "No tienes permiso sobre esta notificación", 403);
        }

        notification.isRead = true;
        await notification.save();

        return sendSuccess(res, notification);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const requesterId = req.user?.id;

        const notification = await Notification.findById(id);

        if (!notification) {
            return sendError(res, "Notificación no encontrada", 404);
        }

        if (!requesterId || notification.recipient.toString() !== requesterId.toString()) {
            return sendError(res, "No tienes permiso sobre esta notificación", 403);
        }

        await notification.deleteOne();

        return sendSuccess(res, notification);
    } catch (error) {
        return sendError(res, (error as Error).message, 500);
    }
};
