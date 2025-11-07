"use client";
import Overlay from "@/components/Overlay";
import announcements from "./fake_announcements.json";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImCross } from "react-icons/im";

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
            <div className="fixed flex justify-center w-full z-30">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl bg-black rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.15)] overflow-hidden"
                >
                    <div className="flex flex-row justify-between items-center px-6 pt-6 pb-2 border-b">
                        <h3>{title}</h3>
                        <button
                            className="bg-neutral-900 hover:bg-neutral-900/50 text-sm p-3 rounded-full"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <ImCross />
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
                        onClose={() => setShowAnnouncement(null)}
                        title={announcements[showAnnouncement].title}
                        announcement={
                            announcements[showAnnouncement].announcement
                        }
                    />
                ) : null}
            </AnimatePresence>

            <h1 className="text-center mb-10">Announcements</h1>
            {announcements.map((announcement, i) => (
                <div
                    key={i}
                    className="p-5 flex flex-col gap-2 cursor-pointer bg-zinc-900 rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-101 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
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
