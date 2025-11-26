"use client";
import { useUI } from "@/context/UIContext";
import { Conversation } from "@/lib/Conversation";
import { useEffect, useState } from "react";
import { Profile } from "@/components/Messages";
import UserConversation from "@/components/Conversation";
import { useMessageProvider } from "@/context/messagesContext";
import { useSearchParams, useRouter } from "next/navigation";
import { PublicUser } from "@/lib/User";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Messages() {
    const searchParams = useSearchParams();
    const user_id = searchParams.get("user")
        ? Number(searchParams.get("user"))
        : null;
    const router = useRouter();
    const { setLoading, notify } = useUI();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isConversationsFetched, setIsConversationsFetched] =
        useState<Boolean>(false);
    const [isConversationsCombined, setIsConversationsCombined] =
        useState<Boolean>(false);
    const {
        receivedConversations,
        setContactedUsers,
        onlineUsers,
        setRead,
        unreadMsgCount,
    } = useMessageProvider();
    const [allConversations, setAllConversations] = useState<Conversation[]>(
        [],
    );
    const [userConversation, setUserConversation] =
        useState<Conversation | null>(null);
    async function fetchUser(user_id: number): Promise<PublicUser | null> {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/profile/${user_id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            return data;
        } catch (e: any) {
            notify(e.message, "error");
            return null;
        } finally {
            setLoading(false);
        }
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
            setConversations((prev) => {
                let conversations = [
                    ...data.map((c: Conversation) => {
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
                ];
                setIsConversationsFetched(true);
                return conversations;
            });
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        async function setConversation() {
            if (isConversationsFetched && isConversationsCombined) {
                let conversation: Conversation | null =
                    allConversations.find((c) => c.id === user_id) ?? null;
                if (!conversation && user_id !== null) {
                    const fetchedUser: PublicUser | null =
                        await fetchUser(user_id);
                    if (fetchedUser) {
                        conversation = {
                            id: user_id,
                            avatar: fetchedUser.avatar,
                            username: fetchedUser.username,
                            received_messages: [],
                            sent_messages: [],
                        };
                        setConversations((prev) => {
                            return [...prev, conversation!];
                        });
                    }
                } else if (conversation && user_id !== null) {
                    setRead(user_id);
                }
                setUserConversation(conversation);
            }
        }
        setConversation();
    }, [user_id, isConversationsFetched, isConversationsCombined]);
    useEffect(() => {
        fetchMessages();
    }, []);
    useEffect(() => {
        let copyReceivedConversations: Conversation[] = structuredClone(
            receivedConversations,
        );
        let combinedConvo: Conversation[] = [];
        conversations.forEach((convo1: Conversation, x: number) => {
            let found = false;
            receivedConversations.forEach((convo2: Conversation, y: number) => {
                if (convo1.id === convo2.id) {
                    combinedConvo.push({
                        ...convo1,
                        received_messages: [
                            ...convo1.received_messages,
                            ...convo2.received_messages,
                        ],
                        sent_messages: [
                            ...convo1.sent_messages,
                            ...convo2.sent_messages,
                        ],
                    });
                    copyReceivedConversations =
                        copyReceivedConversations.filter((item) => {
                            return item.id !== convo1.id;
                        });
                    found = true;
                }
            });
            if (!found) combinedConvo.push(convo1);
        });
        combinedConvo = [...combinedConvo, ...copyReceivedConversations];
        setAllConversations(combinedConvo);
        setContactedUsers(combinedConvo.map((u) => u.id));
        if (isConversationsFetched) setIsConversationsCombined(true);
    }, [conversations, receivedConversations]);

    // Update active userConversation if allConversations updates
    useEffect(() => {
        let conversation: Conversation | null =
            allConversations.find((c) => c.id === user_id) ?? null;
        if (user_id && conversation) {
            setUserConversation(conversation);
            setRead(user_id);
        }
    }, [allConversations]);
    return (
        <main className="pt-[150px]">
            <h1 className="text-center mb-5">Messages</h1>

            <div className="mx-5 grid grid-cols-4 gap-5 rounded-xl h-[calc(100vh-250px)]">
                <section
                    className={`p-5 overflow-y-auto overflow-x-hidden ${userConversation === null ? "col-span-4" : "col-span-1"}`}
                >
                    {allConversations.map((c) => (
                        <Profile
                            key={c.id}
                            username={c.username}
                            avatar={c.avatar}
                            onClick={() => {
                                router.push(`?user=${c.id}`);
                            }}
                            isOnline={
                                onlineUsers.find((u) => u.id === c.id)?.online!
                            }
                            unreadMsgs={
                                c.id !== userConversation?.id
                                    ? (unreadMsgCount.find(
                                          (item) => item.sender_id === c.id,
                                      )?.unreadMsgs ?? 0)
                                    : 0
                            }
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
