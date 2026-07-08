import { Types } from "mongoose";

export interface Day {
    _id: Types.ObjectId;
    itineraryId: Types.ObjectId;
    title: string;
    description: string;
    date: Date;
    location?: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}
