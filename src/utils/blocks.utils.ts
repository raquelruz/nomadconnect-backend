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

export const getBlockedRelationIds = async (userId: string): Promise<string[]> => {
    const me = await User.findById(userId).select("blockedUsers").lean();
    const blockedByMe = me?.blockedUsers?.map((id) => id.toString()) || [];

    const blockedMe = await User.find({ blockedUsers: userId }).select("_id").lean();
    const whoBlockedMe = blockedMe.map((u) => u._id.toString());

    return [...new Set([...blockedByMe, ...whoBlockedMe])];
};