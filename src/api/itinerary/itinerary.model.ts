import mongoose, { Schema } from "mongoose";

const itinerarySchema = new Schema(
    {
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "trips",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        days: {
            type: Schema.Types.ObjectId,
            ref: "days"
        }
    },
    { timestamps: true }
);

export const Itinerary = mongoose.model("itineraries", itinerarySchema);