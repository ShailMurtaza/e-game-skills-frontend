import { Conversation } from "@/lib/Conversation";
import { Message } from "./Messages";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserConversation({
    conversation,
}: {
    conversation: Conversation;
}) {
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

            <div className="overflow-y-auto max-h-full pt-[75px] pb-[75px] px-5 space-y-6">
                <Message
                    type="sent"
                    content="Hi! How are you?"
                    date="Today"
                    time="04:50 PM"
                />
                <Message
                    type="received"
                    content="I'm fine. what is up?"
                    time="10:40 PM"
                />
            </div>
        </>
    );
}
