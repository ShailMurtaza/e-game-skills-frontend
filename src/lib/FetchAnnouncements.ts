import type { Announcement } from "./Announcement";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function fetchAnnouncements() {
    try {
        const res = await fetch(`${API_URL}/announcements`, {
            method: "GET",
            credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        return {
            announcements: data.map((announcement: Announcement) => {
                const date = new Date(announcement.date)
                    .toISOString()
                    .split("T")[0];
                return { ...announcement, date: date };
            }),
            message: "",
            error: false,
        };
    } catch (e: unknown) {
        const message =
            e instanceof Error ? e.message : "An unexpected error occurred";
        return {
            announcements: [],
            message: message,
            error: true,
        };
    }
}
