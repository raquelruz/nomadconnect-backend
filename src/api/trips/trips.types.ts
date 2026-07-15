import { Types } from "mongoose";

export type TripType = {
    _id: Types.ObjectId;
    title: string;
    country: string;
    city: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    maxMembers: number;
    itineraries: Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    description: string;
    image: string;
    visibility: "public" | "private";
    status: "pending" | "completed";
};