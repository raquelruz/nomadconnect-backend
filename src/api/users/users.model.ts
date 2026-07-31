import mongoose, { Schema } from "mongoose";
import { UserType } from "./users.types.js";

const userSchema: Schema<UserType> = new Schema(
    {
        username: {
            type: String,
            required: [true, "El nombre de usuario es obligatorio."],
            unique: true,
            index: true,
            trim: true,
        },

        email: {
            type: String,
            required: [true, "El email es obligatorio."],
            lowercase: true,
            inmutable: true, // OJO. Una vez creado, no se podrá cambiar.
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria."],
            select: false, // Cuando hagas un .find() la contraseña no vendrá por defecto.
        },

        role: {
            type: String,
            enum: ["admin", "user", "moderator"],
            default: "user"
        },

        name: {
            type: String,
        },

        surname: {
            type: String,
        },

        avatar: { type: String },

        bio: {
            type: String,
            minLength: 10,
            maxLength: [200, "La biografía no puede superar los 200 caracteres."],
        },

        languages: {
            type: [String],
            default: [],
        },

        isPublic: {
            type: Boolean,
            required: true,
            default: false,
        },

        likedTrips: [
            {
                type: Schema.Types.ObjectId,
                ref: "trips"
            }
        ]
    },
    
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.virtual("fullName").get(function () {
    if (this.name && this.surname) return `${this.name} ${this.surname}`;
    return this.name || this.surname || this.username;
});

export const User = mongoose.model<UserType>("users", userSchema);
