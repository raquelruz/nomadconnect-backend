import mongoose, { Schema } from "mongoose";
import { ActivityType } from "./activity.types.js";

const activitySchema = new Schema(
    {
        dayId: {
            type: Schema.Types.ObjectId,
            ref: "days",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        members: [
            { 
                type: Schema.Types.ObjectId,
                ref: "users"
            }
        ],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            default: "",
        },

        maxParticipants: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals : true },
        toObject: { virtuals: true }
    }
);

activitySchema.virtual("comments", {
    ref: "comments",
    localField: "_id",
    foreignField: "targetId",
    match: {
        targetModel: "activities"
    }
});

export const Activity = mongoose.model<ActivityType>("activities", activitySchema);