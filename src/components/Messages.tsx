const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function Profile({
    username,
    avatar,
    onClick,
}: {
    username: string;
    avatar: string | null;
    onClick: () => void;
}) {
    return (
        <div
            className="mb-5 bg-zinc-900 p-6 rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-row items-center gap-5">
                <img
                    src={
                        avatar !== null
                            ? `${API_URL}/users/avatar/${avatar}`
                            : "/profile.png"
                    }
                    width="50px"
                    className="rounded-full"
                />
                <span>{username}</span>
            </div>
        </div>
    );
}

export function Message({
    type,
    content,
    date,
    time,
}: {
    type: "sent" | "received";
    content: string;
    date?: string;
    time: string;
}) {
    return (
        <div className="flex-1 p-4">
            <div className="text-center text-gray-400 text-sm">{date}</div>
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
