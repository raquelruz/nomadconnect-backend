import { Types } from "mongoose"

export type UpdateType = {
    _id: Types.ObjectId;
    tripId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    media: string[];
};