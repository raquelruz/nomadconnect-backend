import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
{
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    text: {
        type: String,
        required: true,
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

    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "comments",
        default: null,
    },
},
{
    timestamps:true
});

export const Comment = mongoose.model("comments", commentSchema);
