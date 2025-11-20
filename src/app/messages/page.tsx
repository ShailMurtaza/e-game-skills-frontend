"use client";
import { useUI } from "@/context/UIContext";
import { Conversation } from "@/lib/Conversation";
import { useEffect, useState } from "react";
import { Profile } from "@/components/Messages";
import UserConversation from "@/components/Conversation";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Messages() {
    const { setLoading, notify } = useUI();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [userConversation, setUserConversation] =
        useState<Conversation | null>(null);
    function connect() {
        const socket = new WebSocket("ws://localhost:3002");
        socket.onopen = function () {
            console.log("Connected");
            socket.send(
                JSON.stringify({
                    event: "sendMessage",
                    data: {
                        toUserId: 123,
                        content: "what the fuck?",
                    },
                }),
            );
            socket.onmessage = (e) => {
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
        };
    }

    async function fetchMessages() {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/messages`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setConversations(
                data.map((c: Conversation) => {
                    return {
                        ...c,
                        sent_messages: c.sent_messages.map((m) => ({
                            ...m,
                            timestamp: new Date(m.timestamp),
                        })),
                        received_messages: c.received_messages.map((m) => ({
                            ...m,
                            timestamp: new Date(m.timestamp),
                        })),
                    } as Conversation;
                }),
            );
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMessages();
    }, []);
    return (
        <main className="pt-[150px]">
            <h1 className="text-center mb-5">Messages</h1>

            <div className="mx-5 grid grid-cols-4 gap-5 rounded-xl h-[calc(100vh-250px)]">
                <section
                    className={`p-5 overflow-y-auto overflow-x-hidden ${userConversation === null ? "col-span-4" : "col-span-1"}`}
                >
                    {conversations.map((c) => (
                        <Profile
                            key={c.id}
                            username={c.username}
                            avatar={c.avatar}
                            onClick={() => {
                                setUserConversation(c);
                            }}
                        />
                    ))}
                </section>

                {userConversation !== null && (
                    <section className="relative col-span-3 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <UserConversation conversation={userConversation} />
                    </section>
                )}
            </div>
        </main>
    );
}
