"use client";
import UserConversation from "@/components/Conversation";
import { LoadingComponent } from "@/components/Loading";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import { Conversation, Message } from "@/lib/Conversation";
import { UserProfile } from "@/lib/User";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ConversationPage() {
    const searchParams = useSearchParams();
    const sender_id = searchParams.get("sender_id") ?? null;
    const receiver_id = searchParams.get("receiver_id") ?? null;
    const [receiver, setReceiver] = useState<UserProfile | null>(null);
    const { setLoading, notify } = useUI();
    const [userConversation, setUserConversation] =
        useState<Conversation | null>(null);
    async function fetchConversation(sender_id: number, receiver_id: number) {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/conversation`, {
                method: "POST",
                body: JSON.stringify({
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                }),
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            const messages = data.conversation.map((m: Message) => ({
                ...m,
                timestamp: new Date(m.timestamp),
            }));
            setUserConversation({
                id: data.sender.id as number,
                avatar: data.sender.avatar as string,
                username: data.sender.username as string,
                // Set messages to any since UserConversation component combine them anyway
                sent_messages: messages,
                received_messages: [],
            });
            // Set the receiver to show in Conversation
            setReceiver(data.receiver);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (sender_id && receiver_id) {
            fetchConversation(Number(sender_id), Number(receiver_id));
        }
    }, [sender_id, receiver_id]);
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "admin"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px]">
            <h1 className="text-center mb-5">Messages</h1>

            <div className="mx-5 h-[calc(100vh-250px)]">
                {userConversation !== null && receiver !== null && (
                    <section className="relative h-full overflow-hidden border border-red">
                        <UserConversation
                            conversation={userConversation}
                            receiver={receiver}
                            closeConversationAction={() => {}}
                        />
                    </section>
                )}
            </div>
        </main>
    );
}
