"use client";
import { Conversation, Message } from "@/lib/Conversation";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useUI } from "./UIContext";

type msgData = { toUserId: number; content: string };
type UnreadCountType = { sender_id: number; unreadMsgs: number };
type OnlineUsers = { id: number; online: boolean };
type MessageContextType = {
    receivedConversations: Conversation[];
    unreadMsgCount: UnreadCountType[];
    sendMsg: (data: msgData) => void;
    contactedUsers: number[];
    setContactedUsers: (users: number[]) => void;
    onlineUsers: OnlineUsers[];
    setRead: (user_id: number) => void;
};
type UserConvo = {
    content: string;
    id: number;
    read: boolean;
    sender_id: number;
    receiver_id: number;
    timestamp: string;
    receiver: {
        id: number;
        username: string;
        avatar: string;
    };
    sender: {
        id: number;
        username: string;
        avatar: string;
    };
};
type WSMessagePayload = {
    message: string | null;
    error: boolean;
    data: UserConvo;
};

type WSMessageEvent = {
    event: "newMessage" | "messageSent";
    data: WSMessagePayload;
};

type WSOnlineEvent = {
    event: "isOnline";
    data: {
        message: string | null;
        error: boolean;
        data: { id: number; online: boolean }[];
    };
};
type WSUnreadEvent = {
    event: "setUnread";
    data: {
        message: string | null;
        error: boolean;
        data: UnreadCountType[];
    };
};
type WSEvent = WSMessageEvent | WSOnlineEvent | WSUnreadEvent;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WEBSOCKET_SERVER = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER;
const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [receivedConversations, setReceivedConversations] = useState<
        Conversation[]
    >([]);
    const [unreadMsgCount, setUnreadCount] = useState<UnreadCountType[]>([]);
    const { notify } = useUI();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
    const [contactedUsers, setContactedUsers] = useState<number[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);

    async function getUnreadMsg() {
        try {
            const res = await fetch(`${API_URL}/messages/unread`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Failed");
            setUnreadCount(data.count);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        }
    }
    const contactedUsersRef = useRef<number[]>([]);

    function setNewMesssage(message: UserConvo, type: "received" | "sent") {
        const newMessage: Message = {
            id: message.id,
            content: message.content,
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            read: message.read,
            timestamp: new Date(message.timestamp),
        };
        setReceivedConversations((prevConversations) => {
            let found = false;
            let newMessages: Conversation[] = [];
            if (type === "received") {
                newMessages = prevConversations.map((u) => {
                    if (u.id === message.sender_id) {
                        found = true;
                        // Append new received message
                        return {
                            ...u,
                            sent_messages: [
                                ...u.sent_messages,
                                {
                                    ...newMessage,
                                    timestamp: new Date(newMessage.timestamp),
                                },
                            ],
                        };
                    }
                    return u;
                });
                if (!found) {
                    newMessages = [
                        ...newMessages,
                        {
                            id: message.sender.id,
                            username: message.sender.username,
                            avatar: message.sender.avatar,
                            sent_messages: [
                                {
                                    ...newMessage,
                                    timestamp: new Date(newMessage.timestamp),
                                },
                            ],
                            received_messages: [],
                        },
                    ];
                }
            } else {
                newMessages = prevConversations.map((u) => {
                    if (u.id === message.receiver_id) {
                        found = true;
                        // Append new sent message
                        return {
                            ...u,
                            received_messages: [
                                ...u.received_messages,
                                {
                                    ...newMessage,
                                    timestamp: new Date(newMessage.timestamp),
                                },
                            ],
                        };
                    }
                    return u;
                });
                if (!found) {
                    newMessages = [
                        ...newMessages,
                        {
                            id: message.receiver.id,
                            username: message.receiver.username,
                            avatar: message.receiver.avatar,
                            received_messages: [
                                {
                                    ...newMessage,
                                    timestamp: new Date(newMessage.timestamp),
                                },
                            ],
                            sent_messages: [],
                        },
                    ];
                }
            }
            return newMessages;
        });
    }

    useEffect(() => {
        contactedUsersRef.current = contactedUsers;
    }, [contactedUsers]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (wsRef.current && contactedUsersRef.current.length) {
                wsRef.current?.send(
                    JSON.stringify({
                        event: "isOnline",
                        data: contactedUsersRef.current,
                    }),
                );
            }
        }, 3000);
        let isMounted = true;
        function connect() {
            if (!isMounted) return;
            const ws = new WebSocket(WEBSOCKET_SERVER!);
            wsRef.current = ws;
            ws.onopen = function () {
                console.log("WebSocket Connected");
                if (reconnectTimer.current) {
                    clearTimeout(reconnectTimer.current);
                    reconnectTimer.current = null;
                }
                ws.onmessage = (e) => {
                    const data = JSON.parse(e.data) as WSEvent;
                    if (data.data.error) {
                        notify(data.data.message!, "error");
                        return;
                    }

                    const isOpen = window.location.pathname === "/messages";
                    switch (data.event) {
                        case "newMessage":
                            getUnreadMsg();
                            if (isOpen) {
                                const message = data.data.data;
                                setNewMesssage(message, "received");
                            }
                            notify("New Message", "success");
                            break;
                        case "messageSent":
                            getUnreadMsg();
                            if (isOpen) {
                                const message = data.data.data;
                                setNewMesssage(message, "sent");
                            }
                            break;
                        case "isOnline":
                            setOnlineUsers(data.data.data);
                            break;
                        case "setUnread":
                            const message = data.data.data;
                            setUnreadCount(message);
                            break;
                    }
                };
                ws.onclose = () => {
                    console.log("WebSocket closed. Retrying in 2s...");
                    retry();
                };
                ws.onerror = () => {
                    console.log("WebSocket error. Closing socket...");
                    ws.close();
                };
            };
        }
        function retry() {
            if (reconnectTimer.current) return;
            reconnectTimer.current = setTimeout(() => {
                reconnectTimer.current = null;
                connect();
            }, 2000);
        }
        getUnreadMsg();
        connect();
        return () => {
            isMounted = false;
            wsRef.current?.close();
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            clearInterval(intervalId);
        };
    }, []);
    function sendMsg(data: msgData) {
        wsRef.current?.send(
            JSON.stringify({
                event: "sendMessage",
                data: data,
            }),
        );
    }
    function setRead(user_id: number) {
        wsRef.current?.send(
            JSON.stringify({
                event: "setRead",
                data: user_id,
            }),
        );
    }
    return (
        <MessageContext.Provider
            value={{
                receivedConversations,
                unreadMsgCount,
                sendMsg,
                contactedUsers,
                setContactedUsers,
                onlineUsers,
                setRead,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}

export function useMessageProvider() {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error("useMessages must be used within a MessageProvider");
    }

    return context;
}
