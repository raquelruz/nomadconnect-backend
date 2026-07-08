import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: [true, "El comentario debe tener un autor"],
        },
        
        text: {
            type: String,
            required: [true, "El texto del comentario es obligatorio"],
        },

        targetId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "targetModel",
        },

        targetModel: {
            type: String,
            required: true,
            enum: ["trips", "activities"],
        },
    },

    { timestamps: true }
);

export const Comment = mongoose.model("comments", commentSchema);
