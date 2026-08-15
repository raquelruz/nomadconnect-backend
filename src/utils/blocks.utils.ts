import { User } from "../api/users/users.model.js";

export const areUsersBlocked = async (userIdA: string, userIdB: string): Promise<boolean> => {
    const blockRelation = await User.findOne({
        $or: [
            { _id: userIdA, blockedUsers: { $in: [userIdB] } }, 
            { _id: userIdB, blockedUsers: { $in: [userIdA] } }, 
        ],
    }).select("id");

    return blockRelation !== null;
};