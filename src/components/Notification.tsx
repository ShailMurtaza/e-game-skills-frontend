"use client";
import { useUI } from "@/context/UIContext";

export default function Notification() {
    const { notification } = useUI();
    if (!notification) return null;

    const color =
        notification.type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <div
            className={`${color} fixed top-4 right-4 text-white px-4 py-2 rounded-lg shadow-md z-60`}
        >
            {notification.message}
        </div>
    );
}
