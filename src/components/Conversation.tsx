"use client";
import { useEffect, useState } from "react";
import { Conversation, Message } from "@/lib/Conversation";
import { MessageComponent } from "./Messages";
import { useMessageProvider } from "@/context/messagesContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserConversation({
    conversation,
}: {
    conversation: Conversation;
}) {
    const [userMessages, setUserMessages] = useState<Message[]>([]);
    const [msg, setMsg] = useState<string>("");
    const { sendMsg } = useMessageProvider();
    useEffect(() => {
        const messages: Message[] = [
            ...conversation.received_messages,
            ...conversation.sent_messages,
        ];
        const sortedMessages = [...messages].sort(
            (a, b) => +a.timestamp - +b.timestamp,
        );
        setUserMessages(sortedMessages);
    }, [conversation]);
    function handleSendMsg() {
        sendMsg({ toUserId: conversation.id, content: msg });
        setMsg("");
    }
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
                        className="rounded-full w-[50px] h-[50px]"
                    />
                    <span>{conversation.username}</span>
                </div>
            </div>

            <div className="absolute bottom-0 w-full bg-zinc-900 p-4 flex items-center">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl outline-none bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                    value={msg}
                    onChange={(e) => {
                        setMsg(e.target.value);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            handleSendMsg();
                        }
                    }}
                />
                <button
                    className="ml-3 transition-colors bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                    onClick={() => {
                        handleSendMsg();
                    }}
                >
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
