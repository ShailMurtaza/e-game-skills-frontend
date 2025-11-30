"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Conversation, Message } from "@/lib/Conversation";
import { MessageComponent } from "./Messages";
import { useMessageProvider } from "@/context/messagesContext";
import { DangerBtn } from "./Dashboard";
import { MdOutlineReportProblem } from "react-icons/md";
import ReportPopup from "./ReportPopup";
import { UserProfile } from "@/lib/User";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import formatDate from "@/lib/FormatDate";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserConversation({
    conversation,
    closeConversationAction,
    receiver = null,
}: {
    conversation: Conversation;
    closeConversationAction: () => void;
    receiver?: UserProfile | null;
}) {
    const [report, setReport] = useState<boolean>(false);
    const [userMessages, setUserMessages] = useState<Message[]>([]);
    const [msg, setMsg] = useState<string>("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    // flag to detect the initial scroll for the current conversation
    const initialScrollRef = useRef<boolean>(true);
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
        initialScrollRef.current = true;
    }, [conversation]);
    useEffect(() => {
        console.log(receiver);
    }, [receiver]);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        if (initialScrollRef.current) {
            // instant (no animation) so there's no visible jump
            el.scrollTop = el.scrollHeight;
            initialScrollRef.current = false;
        } else {
            // smooth for subsequent updates (new incoming messages)
            // prefer element.scrollTo so we control the container directly
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
    }, [userMessages]);
    function handleSendMsg() {
        if (msg.trim().length > 0) {
            sendMsg({ toUserId: conversation.id, content: msg.trim() });
            setMsg("");
        }
    }
    return (
        <>
            {report && (
                <ReportPopup
                    username={conversation.username}
                    user_id={conversation.id}
                    setReportAction={setReport}
                />
            )}
            <div className="absolute top-0 w-full text-lg font-semibold bg-zinc-900 p-4 z-10">
                <div className="flex flex-row items-center gap-5">
                    {receiver === null && (
                        <button
                            className="lg:hidden p-2 bg-zinc-700 shadow-[2px_3px_5px_2px_rgba(255,255,255,0.3)] rounded-full text-white"
                            onClick={closeConversationAction}
                        >
                            <MdOutlineArrowBackIosNew size={25} />
                        </button>
                    )}
                    <Image
                        src={
                            conversation.avatar !== null
                                ? `${API_URL}/users/avatar/${conversation.avatar}`
                                : "/profile.png"
                        }
                        width={50}
                        height={50}
                        alt="Profile Img"
                        className="rounded-full w-[50px] h-[50px]"
                    />
                    <span className="lg:text-base text-sm">
                        {conversation.username}
                    </span>
                    <div className="ml-auto">
                        {receiver ? (
                            <div className="flex flex-row items-center lg:gap-5 gap-2">
                                <span className="lg:text-base text-sm">
                                    {receiver.username}
                                </span>
                                <Image
                                    src={
                                        receiver.avatar !== null
                                            ? `${API_URL}/users/avatar/${receiver.avatar}`
                                            : "/profile.png"
                                    }
                                    width={50}
                                    height={50}
                                    alt="Profile Img"
                                    className="rounded-full w-[50px] h-[50px]"
                                />
                            </div>
                        ) : (
                            <DangerBtn
                                onClick={() => {
                                    setReport(true);
                                }}
                                className="flex flex-row justify-center items-center gap-1"
                            >
                                <MdOutlineReportProblem size={20} />
                                Report
                            </DangerBtn>
                        )}
                    </div>
                </div>
            </div>

            {receiver === null && (
                <div className="absolute bottom-0 w-full bg-zinc-900 p-4 flex items-center z-0">
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
            )}

            <div
                ref={containerRef}
                className="flex flex-col gap-5 py-5 absolute top-[75px] bottom-[75px] w-full overflow-y-auto px-5"
            >
                {userMessages.map((m: Message, idx: number) => {
                    const currentDate = m.timestamp.toLocaleDateString();
                    const prevDate =
                        idx > 0
                            ? userMessages[
                                  idx - 1
                              ].timestamp.toLocaleDateString()
                            : null;
                    const showDate = prevDate !== currentDate;
                    const currentDateString = formatDate(m.timestamp);
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
                <div ref={bottomRef}></div>
            </div>
        </>
    );
}
