"use client";
import { useEffect, useState } from "react";
import { Conversation, Message } from "@/lib/Conversation";
import { MessageComponent } from "./Messages";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserConversation({
    conversation,
}: {
    conversation: Conversation;
}) {
    const [userMessages, setUserMessages] = useState<Message[]>([]);
    useEffect(() => {
        const messages: Message[] = [
            ...conversation.received_messages,
            ...conversation.sent_messages,
        ];
        console.log(messages);
        const sortedMessages = [...messages].sort(
            (a, b) => +a.timestamp - +b.timestamp,
        );
        console.log(sortedMessages);
        setUserMessages(sortedMessages);
    }, [conversation]);
    return (
        <>
            <div className="absolute top-0 w-full text-lg font-semibold bg-zinc-900 p-4">
                <div className="flex flex-row items-center gap-5">
                    <img
                        src={
                            conversation.avatar !== null
                                ? `${API_URL}/users/avatar/${conversation.avatar}`
                                : "/profile.png"
                        }
                        width="50px"
                        className="rounded-full"
                    />
                    <span>{conversation.username}</span>
                </div>
            </div>

            <div className="absolute bottom-0 w-full bg-zinc-900 p-4 flex items-center">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl outline-none bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                />
                <button className="ml-3 transition-colors bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
                    Send
                </button>
            </div>

            <div className="overflow-y-auto max-h-full pt-[75px] pb-[75px] px-5">
                {userMessages.map((m: Message, idx: number) => {
                    const currentDate = m.timestamp.toLocaleDateString();
                    const prevDate =
                        idx > 0
                            ? userMessages[
                                  idx - 1
                              ].timestamp.toLocaleDateString()
                            : null;
                    const showDate = prevDate !== currentDate;
                    const currentDateString = m.timestamp.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        },
                    );
                    return (
                        <MessageComponent
                            key={idx}
                            type={
                                m.sender_id === conversation.id
                                    ? "sent"
                                    : "received"
                            }
                            content={m.content}
                            time={m.timestamp.toLocaleTimeString()}
                            date={showDate ? currentDateString : null}
                        />
                    );
                })}
            </div>
        </>
    );
}
