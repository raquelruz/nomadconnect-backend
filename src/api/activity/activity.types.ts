import { Types } from "mongoose";

export interface ActivityType {
    _id?: Types.ObjectId;
    dayId: Types.ObjectId;
    title: string;
    description?: string;
    createdBy: Types.ObjectId;
    date: Date;
    time: string;
    location?: string;
    maxParticipants?: number;
    price?: number;
    members?: Types.ObjectId[];
    comments?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    images: string[]
}