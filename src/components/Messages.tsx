const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function Profile({
    username,
    avatar,
    onClick,
    isOnline,
    unreadMsgs,
}: {
    username: string;
    avatar: string | null;
    onClick: () => void;
    isOnline: boolean;
    unreadMsgs: number;
}) {
    return (
        <div
            className="mb-5 bg-zinc-900 p-6 rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 lg:hover:scale-102 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-row items-center gap-5">
                <img
                    src={
                        avatar !== null
                            ? `${API_URL}/users/avatar/${avatar}`
                            : "/profile.png"
                    }
                    className="rounded-full w-[50px] h-[50px]"
                />
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">
                        {username}
                    </h3>
                    <p
                        className={`
                            text-sm font-medium flex items-center gap-1.5
                            ${isOnline ? "text-emerald-400" : "text-zinc-500"}
                        `}
                    >
                        <span className="relative flex">
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    isOnline ? "bg-emerald-400" : "bg-zinc-600"
                                }`}
                            />
                        </span>
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
                {unreadMsgs > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
                    <div className="w-fit text-gray-400 bg-zinc-900 text-sm rounded-2xl px-5 py-1">
                        {date}
                    </div>
                </div>
            )}
            <div
                className={`flex ${type === "sent" ? "justify-start" : "justify-end"}`}
            >
                <div
                    className={`${type === "sent" ? "bg-gray-600" : "bg-blue-600"} bg-blue-600 px-4 py-2 rounded-2xl max-w-fit`}
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
