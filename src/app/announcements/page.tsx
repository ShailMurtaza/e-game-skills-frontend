"use client";
import Overlay from "@/components/Overlay";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImCross } from "react-icons/im";
import { useUI } from "@/context/UIContext";
import { Announcement } from "@/lib/Announcement";
import fetchAnnouncements from "@/lib/FetchAnnouncements";
import { Input } from "@/components/Dashboard";

function DisplayAnnouncement({
    title = "",
    announcement = "",
    onClose,
}: {
    title?: string;
    announcement?: string;
    onClose: () => void;
}) {
    return (
        <>
            <Overlay display="" />
            <div className="fixed flex justify-center w-screen left-0 z-30">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl bg-black rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.15)] overflow-hidden"
                >
                    <div className="flex flex-row justify-between items-center px-4 pt-3 pb-1 border-b border-purple-700 bg-yellow-200 text-blue-900">
                        <h3 className="text-lg font-light tracking-wide">
                            {title}
                        </h3>

                        <button
                            className="bg-pink-300 hover:bg-red-200 text-xs p-2 rounded-none border border-blue-700"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <ImCross />
                        </button>
                    </div>

                    <div className="px-4 pb-4 pt-2 overflow-y-auto max-h-[calc(80vh-90px)] bg-green-100 text-red-800 text-sm leading-tight">
                        <p className="whitespace-pre-line underline decoration-dotted">
                            {announcement}
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default function Announcements() {
    const [showAnnouncement, setShowAnnouncement] = useState<number | null>(
        null,
    );
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [filter, setFilter] = useState<string>("");
    const { setLoading, notify } = useUI();
    useEffect(() => {
        async function loadAnnouncements() {
            setLoading(true);
            const result = await fetchAnnouncements();
            setAnnouncements(result.announcements);
            if (result.error) notify(result.message, "error");
            setLoading(false);
        }
        loadAnnouncements();
    }, []);

    return (
        <main className="pt-[150px] lg:mx-10 mx-1 min-h-screen flex flex-col gap-5 p-6 bg-black text-gray-100">
            <AnimatePresence mode="wait">
                {showAnnouncement !== null ? (
                    <DisplayAnnouncement
                        key={showAnnouncement}
                        onClose={() => setShowAnnouncement(null)}
                        title={announcements[showAnnouncement].title}
                        announcement={
                            announcements[showAnnouncement].announcement
                        }
                    />
                ) : null}
            </AnimatePresence>

            <h1 className="text-center mb-10">Announcements</h1>
            <Input
                name="Filter"
                type="text"
                value={filter}
                placeholder="Enter text to filter ..."
                onChange={(e) => {
                    setFilter(e.target.value);
                }}
            />
            {announcements.map((announcement, i) => {
                if (
                    (announcement.title + " " + announcement.announcement)
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                )
                    return (
                        <div
                            key={i}
                            className="p-2 flex flex-col cursor-default bg-yellow-300 rounded-sm border border-red-700 transition-none hover:bg-green-200"
                            onClick={() => {
                                setShowAnnouncement(i);
                            }}
                        >
                            <h3 className="text-[18px] font-extralight text-blue-900 italic">
                                {announcement.title}
                            </h3>

                            <div className="text-[11px] leading-snug text-purple-800 underline decoration-dashed">
                                {announcement.announcement}
                            </div>

                            <div className="text-[9px] w-fit text-orange-900 bg-pink-300 rounded-md py-[1px] px-[3px] border border-purple-500">
                                {announcement.date}
                            </div>
                        </div>
                    );
            })}
        </main>
    );
}
