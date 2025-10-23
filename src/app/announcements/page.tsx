"use client";
import Overlay from "@/components/Overlay";
import announcements from "./fake_announcements.json";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function DisplayAnnouncement({
    title = "",
    announcement = "",
    setShowAnnouncement,
}: {
    title?: string;
    announcement?: string;
    setShowAnnouncement: (data: any) => void;
}) {
    return (
        <>
            <Overlay display="" />
            <div className="fixed flex justify-center w-full z-30">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl max-h-[80vh] bg-black rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.15)] overflow-hidden"
                >
                    <div className="flex flex-row justify-between items-center px-6 pt-6 pb-2 border-b">
                        <h3>{title}</h3>
                        <button
                            className="bg-neutral-900 text-sm p-2 rounded-xl"
                            onClick={() => {
                                setShowAnnouncement(null);
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[calc(80vh-90px)]">
                        <p className="whitespace-pre-line">{announcement}</p>
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
    return (
        <main className="pt-[150px] mx-10 min-h-screen flex flex-col gap-5 p-6 bg-black text-gray-100">
            <AnimatePresence mode="wait">
                {showAnnouncement !== null ? (
                    <DisplayAnnouncement
                        key={showAnnouncement}
                        setShowAnnouncement={setShowAnnouncement}
                        title={announcements[showAnnouncement].title}
                        announcement={
                            announcements[showAnnouncement].announcement
                        }
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>

            <h1 className="text-center mb-10">Announcements</h1>
            {announcements.map((announcement, i) => (
                <div
                    key={i}
                    className="p-5 flex flex-col gap-2 border-1 border-white cursor-pointer"
                    onClick={() => {
                        setShowAnnouncement(i);
                    }}
                >
                    <h3>{announcement.title}</h3>
                    <div className="line-clamp-2">
                        {announcement.announcement}
                    </div>
                    <div className="text-sm">23, October 2025</div>
                </div>
            ))}
        </main>
    );
}
