export type Message = {
    id: number;
    content: string;
    sender_id: number;
    receiver_id: number;
    timestamp: Date;
};

export type Conversation = {
    id: number;
    username: string;
    avatar: string | null;
    sent_messages: Message[];
    received_messages: Message[];
};
