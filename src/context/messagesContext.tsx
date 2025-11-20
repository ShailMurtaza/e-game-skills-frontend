"use client";
import { Conversation } from "@/lib/Conversation";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useUI } from "./UIContext";

type MessageContextType = {
    messages: Conversation[];
    unreadMsgCount: number;
    resetUnreadCount: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WEBSOCKET_SERVER = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER;
const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Conversation[]>([]);
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
        console.log(WEBSOCKET_SERVER!);
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
                ws.send(
                    JSON.stringify({
                        event: "sendMessage",
                        data: {
                            toUserId: 1,
                            content: "New Message",
                        },
                    }),
                );
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data);

                    switch (msg.event) {
                        case "newMessage":
                            console.log("Received:", msg.data);
                            break;
                        case "messageSent":
                            console.log("Delivered:", msg.data);
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
    return (
        <MessageContext.Provider
            value={{ messages, unreadMsgCount, resetUnreadCount }}
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
