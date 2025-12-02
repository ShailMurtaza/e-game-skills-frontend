import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function Profile({
    username,
    avatar,
    onClick,
    isOnline,
    unreadMsgs,
    banned = false,
}: {
    username: string;
    avatar: string | null;
    onClick: () => void;
    isOnline: boolean;
    unreadMsgs: number;
    banned?: boolean;
}) {
    return (
        <div
            className="mb-5 bg-gray-900 border-1 border-red-500 p-4 rounded-none cursor-pointer transition-transform duration-300"
            onClick={onClick}
        >
            <div className="flex flex-row items-center gap-3">
                <Image
                    src={
                        avatar !== null
                            ? `${API_URL}/users/avatar/${avatar}`
                            : "/profile.png"
                    }
                    alt="Profile"
                    width={50}
                    height={0}
                    className="rounded-none w-[50px] h-[50px] border-none"
                />
                <div className="flex-1">
                    <h3 className="text-red-700 font-normal text-lg">
                        {username}
                    </h3>
                    <p
                        className={`
                    text-sm flex items-center gap-1
                    ${isOnline ? "text-green-700" : "text-purple-700"}
                `}
                    >
                        <span className="relative flex">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    isOnline ? "bg-green-700" : "bg-purple-500"
                                }`}
                            />
                        </span>
                        {isOnline ? "Online" : "Offline"}
                    </p>
                    {banned && (
                        <p className="text-sm text-orange-700 flex items-center gap-1">
                            <span className="relative flex">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            </span>
                            Banned
                        </p>
                    )}
                </div>
                {unreadMsgs > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">
                        {unreadMsgs}
                    </div>
                )}
            </div>
        </div>
    );
}

export function MessageComponent({
    type,
    content,
    date,
    time,
}: {
    type: "sent" | "received";
    content: string;
    date: string | null;
    time: string;
}) {
    return (
        <div>
            {date && (
                <div className="flex justify-center mb-3">
                    <div className="w-fit text-gray-400 bg-zinc-900 text-sm px-5 py-1">
                        {date}
                    </div>
                </div>
            )}
            <div
                className={`flex ${type === "sent" ? "justify-start" : "justify-end"}`}
            >
                <div
                    className={`${type === "sent" ? "bg-gray-600" : "bg-blue-600"} bg-blue-600 px-4 py-2 max-w-fit`}
                >
                    <p>{content}</p>
                    <span className="block text-xs text-gray-300 text-right mt-1">
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
}
