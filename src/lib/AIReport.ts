export type AIReport = {
    id: number;
    timestamp: Date;
    is_reviewed: boolean;
    toxicity: number;
    message: string;
    msg_sender_user: {
        id: number;
        username: string;
    };
    msg_receiver_user: {
        id: number;
        username: string;
    };
};
