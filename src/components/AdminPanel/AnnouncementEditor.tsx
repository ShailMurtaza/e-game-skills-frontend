"use client";
import { useEffect, useState } from "react";
import Overlay from "@/components/Overlay";
import { motion } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { Announcement } from "@/lib/Announcement";
import Button from "./Buttons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function AnnouncementEditor({
    announcement,
    setShowAnnouncementEditor,
    setAnnouncement,
}: {
    announcement: Announcement;
    setShowAnnouncementEditor: (data: number | null) => void;
    setAnnouncement: (data: Announcement) => void;
}) {
    const [form, setForm] = useState<Announcement>({ ...announcement });
    useEffect(() => {
        setForm({ ...announcement });
    }, [announcement]);
    const { setLoading, notify } = useUI();

    async function saveAnnouncement() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/announcement`, {
                body: JSON.stringify(form),
                method: form?.id ? "PATCH" : "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setAnnouncement(data.announcement);
            notify(data.message, "success");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Overlay display="" />
            <div className="fixed inset-0 flex justify-center items-center w-full h-full z-30">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800"
                >
                    <div className="flex flex-col gap-3 text-xs text-gray-400">
                        <label>
                            Title
                            <input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Title of Announcement"
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>{" "}
                        <label>
                            Date
                            <input
                                type="date"
                                value={form?.date || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        date: e.target.value,
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>
                        <label>
                            Announcement
                            <textarea
                                value={form?.announcement || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        announcement: e.target.value,
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                                rows={3}
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            label="Save"
                            variant="primary"
                            onClick={saveAnnouncement}
                        />
                        <Button
                            label="Close"
                            variant="neutral"
                            onClick={() => {
                                setShowAnnouncementEditor(null);
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
