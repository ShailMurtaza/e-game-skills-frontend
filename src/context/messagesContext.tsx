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
type MessageContextType = {
    receivedConversations: Conversation[];
    unreadMsgCount: number;
    resetUnreadCount: () => void;
    sendMsg: (data: msgData) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WEBSOCKET_SERVER = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER;
const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [receivedConversations, setReceivedConversations] = useState<
        Conversation[]
    >([]);
    const [unreadMsgCount, setUnreadCount] = useState<number>(0);
    const { setLoading, notify } = useUI();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

    async function getUnreadMsg() {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/messages/unread`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setUnreadCount(data.count);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
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
                    const data: {
                        event: string;
                        data: {
                            message: string | null;
                            error: boolean;
                            data: {
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
                        };
                    } = JSON.parse(e.data);
                    if (data.data.error) {
                        notify(data.data.message!, "error");
                        return;
                    }

                    const isOpen = window.location.pathname === "/messages";
                    switch (data.event) {
                        case "newMessage":
                            if (isOpen) {
                                const message = data.data.data;
                                const newMessage: Message = {
                                    id: message.id,
                                    content: message.content,
                                    sender_id: message.sender_id,
                                    receiver_id: message.receiver_id,
                                    read: message.read,
                                    timestamp: new Date(message.timestamp),
                                };
                                setReceivedConversations(
                                    (prevConversations) => {
                                        let found = false;
                                        let newMessages: Conversation[] =
                                            prevConversations.map((u) => {
                                                if (
                                                    u.id === message.sender_id
                                                ) {
                                                    found = true;
                                                    // Append new received message
                                                    return {
                                                        ...u,
                                                        sent_messages: [
                                                            ...u.sent_messages,
                                                            newMessage,
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
                                                    username:
                                                        message.sender.username,
                                                    avatar: message.sender
                                                        .avatar,
                                                    sent_messages: [newMessage],
                                                    received_messages: [],
                                                },
                                            ];
                                        }
                                        return newMessages;
                                    },
                                );
                            }
                            notify("New Message", "success");
                            // console.log("Received: ", data);
                            break;
                        case "messageSent":
                            // console.log("Delivered: ", data);
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
        };
    }, []);
    function resetUnreadCount() {
        setUnreadCount(0);
    }
    function sendMsg(data: msgData) {
        wsRef.current?.send(
            JSON.stringify({
                event: "sendMessage",
                data: data,
            }),
        );
    }
    return (
        <MessageContext.Provider
            value={{
                receivedConversations,
                unreadMsgCount,
                resetUnreadCount,
                sendMsg,
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
