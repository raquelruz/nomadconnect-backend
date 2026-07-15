import { Request, Response } from "express";
import { Trip } from "../trips.model.js";
import { sendError, sendSuccess } from "../../../utils/response.utils.js";

export const joinTrip = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = (req as any).user?._id || (req as any).user?.id;

		if (!userId) {
			return sendError(res, "Usuario no autenticado", 401);
		}

		const trip = await Trip.findById(id);

		if (!trip) {
			return sendError(res, "Viaje no encontrado", 404);
		}

		// El organizador ya forma parte del viaje
		if (trip.owner.toString() === userId.toString()) {
			return sendError(res, "Ya eres el organizador de este viaje", 400);
		}

		// Ya pertenece al viaje
		const isMember = trip.members.some(
			(member) => member.toString() === userId.toString()
		);

		if (isMember) {
			return sendError(res, "Ya formas parte de este viaje", 400);
		}

		// Viaje completo
		if (
			trip.maxMembers &&
			trip.members.length + 1 >= trip.maxMembers
		) {
			return sendError(res, "El viaje ya está completo", 400);
		}

		trip.members.push(userId);

		await trip.save();

		return sendSuccess(res, trip, "Te has unido al viaje");
	} catch (error) {
		return sendError(res, (error as Error).message, 500);
	}
};

export const leaveTrip = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const userId = (req as any).user?._id || (req as any).user?.id;

		if (!userId) {
			return sendError(res, "Usuario no autenticado", 401);
		}

		const trip = await Trip.findById(id);

		if (!trip) {
			return sendError(res, "Viaje no encontrado", 404);
		}

		// El organizador no puede abandonar el viaje
		if (trip.owner.toString() === userId.toString()) {
			return sendError(
				res,
				"El organizador no puede abandonar el viaje",
				400
			);
		}

		const isMember = trip.members.some(
			(member) => member.toString() === userId.toString()
		);

		if (!isMember) {
			return sendError(
				res,
				"No formas parte de este viaje",
				400
			);
		}

		trip.members = trip.members.filter(
			(member) => member.toString() !== userId.toString()
		);

		await trip.save();

		return sendSuccess(res, trip, "Has abandonado el viaje");
	} catch (error) {
		return sendError(res, (error as Error).message, 500);
	}
};