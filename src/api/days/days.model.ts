import mongoose, { Schema } from "mongoose";

const daySchema = new Schema(
    {
        itineraryId: {
            type: Schema.Types.ObjectId,
            ref: "itineraries",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        title: { type: String },
        description: { type: String },
        location: { type: String },
        order: { type: Number },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

daySchema.virtual("activities", {
    ref: "activities",
    localField: "_id",
    foreignField: "dayId",
});

export const Day = mongoose.model("days", daySchema);
