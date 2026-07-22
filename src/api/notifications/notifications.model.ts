import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["new_comment", "trip_completed", "new_update", "task_completed", "member_joined", "member_left"],
        },
        targetModel: {
            type: String,
            required: true,
            enum: ["trips", "comments", "updates", "tasks"],
        },
        targetId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "targetModel",
        },
        trip: {
            type: Schema.Types.ObjectId,
            ref: "trips",
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model("notifications", notificationSchema);
