import mongoose, { Schema } from "mongoose";
import { TripType } from "./trips.types.js";

const tripSchema: Schema<TripType> = new Schema(
    {
        title: { type: String, required: [true, "El título es obligatorio."] },

        country: { type: String, required: [true, "El país es obligatorio."] },

        city: { type: String, required: [true, "La ciudad es obligatoria."] },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: [true, "El viaje debe tener un propietario."],
        },

        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
        ],

        startDate: { type: Date, required: true },

        endDate: { type: Date, required: true },

        description: {
            type: String,
            default: "",
            minLength: 10,
            maxLength: [2000, "El texto es demasiado largo."],
        },

        visibility: { type: String, enum: ["public", "private"], default: "public" },

        image: { type: String },

        status: { type: String, enum: ["pending", "completed"], default: "pending" },
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tripSchema.virtual("itineraries", {
    ref: "itineraries",
    localField: "_id",
    foreignField: "tripId",
});

tripSchema.virtual("comments", {
    ref: "comments",
    localField: "_id",
    foreignField: "targetId",
    match: {
        targetModel: "trips",
    },
});

tripSchema.virtual("tasks", {
    ref: "tasks",
    localField: "_id",
    foreignField: "tripId",
});

export const Trip = mongoose.model<TripType>("trips", tripSchema);
