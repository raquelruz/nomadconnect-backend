import { Types } from "mongoose";

export const USER_ROLES = ["user", "moderator", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type UserType = {
    id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    name: string;
    surname: string;
    avatar?: string;
    bio?: string;
    languages?: string;
    isPublic: boolean;
    likedTrips?: Types.ObjectId[];
};
