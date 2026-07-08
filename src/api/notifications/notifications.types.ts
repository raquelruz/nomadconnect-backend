export interface NotificationType {
    recipient: string;
    sender: string;
    type: string;
    targetModel: "trips" | "comments" | "updates";
    targetId: string;
    message: string;
    isRead?: boolean;
}
