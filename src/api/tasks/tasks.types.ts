import { Types } from "mongoose";

export type TaskType = {
    _id: Types.ObjectId;
    tripId: Types.ObjectId;
    title: string;
    isCompleted: boolean;
    order?: number;
    assignedTo?: Types.ObjectId;
};