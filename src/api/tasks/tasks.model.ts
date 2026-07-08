import mongoose, { Schema } from "mongoose";
import { TaskType } from "./tasks.types.js";

const taskSchema: Schema<TaskType> = new Schema (
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "trips",
            required: [true, "La tarea debe pertenecer a un viaje"]
        },

        title: { type: String, required: [true, "La tarea debe tener un título"] },
        isCompleted: { type: Boolean, default: false },
        order: { type: Number },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "users"
        }
    },
    { 
        timestamps: true 
    }
);

export const Task = mongoose.model<TaskType>("tasks", taskSchema);