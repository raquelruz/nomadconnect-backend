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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

itinerarySchema.virtual("days", {
    ref: "days",
    localField: "_id",
    foreignField: "itineraryId",
});

export const Itinerary = mongoose.model("itineraries", itinerarySchema);
