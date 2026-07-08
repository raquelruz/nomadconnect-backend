import mongoose, { Schema } from "mongoose";

const updateSchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "trips",
            required: [true, "La actualización debe pertenecer a un viaje"]
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: [true, "La actualización debe tener un autor"]
        },
        content: { type: String, required: [true, "El contenido es obligatorio"] },
        media: [{ type: String }],
    },
    {
        timestamps: true 
    }
);

export const Update = mongoose.model("updates", updateSchema);