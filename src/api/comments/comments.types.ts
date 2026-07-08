import { Types } from "mongoose";

export type CommentType = {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    text: string;
    targetId: Types.ObjectId;
    targetModel: "trips" | "activities";
    parentComment?: Types.ObjectId;
};
