"use client";
import AnnouncementEditor from "@/components/AdminPanel/AnnouncementEditor";
import Button from "@/components/AdminPanel/Buttons";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useUI } from "@/context/UIContext";
import type { Announcement } from "@/lib/Announcement";
import fetchAnnouncements from "@/lib/FetchAnnouncements";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Announcements() {
    const [showAnnouncementEditor, setShowAnnouncementEditor] = useState<
        number | null
    >(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [announcementDelete, setAnnoucementDelete] = useState<number | null>(
        null,
    );
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
    function setAnnouncement(updated_announcement: Announcement) {
        let found = false;
        const date = new Date(updated_announcement.date)
            .toISOString()
            .split("T")[0];
        updated_announcement = {
            ...updated_announcement,
            date: date,
        };
        let newAnnouncements = announcements.map((announcement) => {
            if (announcement.id === updated_announcement.id) {
                found = true;
                return updated_announcement;
            }
            return announcement;
        });
        if (!found) {
            newAnnouncements = announcements;
            newAnnouncements[announcements.length - 1] = updated_announcement;
        }
        setAnnouncements(newAnnouncements);
    }
    async function deleteAnnouncement(announcement_id: number) {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/admin/announcement/${announcement_id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setAnnouncements(
                announcements.filter(
                    (announcement) => announcement.id !== announcement_id,
                ),
            );
            notify(data.message, "success");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setAnnoucementDelete(null);
            setLoading(false);
        }
    }
    return (
        <main>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showAnnouncementEditor !== null ? (
                    <AnnouncementEditor
                        announcement={announcements[showAnnouncementEditor]}
                        setShowAnnouncementEditor={setShowAnnouncementEditor}
                        setAnnouncement={setAnnouncement}
                    />
                ) : null}
            </AnimatePresence>
            {announcementDelete && (
                <DeleteConfirmDialog
                    onCancel={() => {
                        setAnnoucementDelete(null);
                    }}
                    onDelete={() => {
                        deleteAnnouncement(announcementDelete);
                    }}
                />
            )}
            <h4>Announcements</h4>
            <div className="mt-4 space-y-3">
                <Button
                    label="New Announcement"
                    variant="primary"
                    onClick={() => {
                        setAnnouncements((prevAnnouncements) => {
                            const newAnnouncements = [
                                ...prevAnnouncements,
                                { title: "", announcement: "", date: "" },
                            ];
                            setShowAnnouncementEditor(
                                newAnnouncements.length - 1,
                            );
                            return newAnnouncements;
                        });
                    }}
                />
                {announcements.map((ann, idx) => {
                    if (ann?.id)
                        return (
                            <div key={ann.id}>
                                <div className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-white">
                                            {ann.title}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            label="Edit"
                                            variant="secondary"
                                            onClick={() => {
                                                console.log(announcements);
                                                setShowAnnouncementEditor(idx);
                                            }}
                                        />
                                        <Button
                                            label="Delete"
                                            variant="danger"
                                            onClick={() => {
                                                setAnnoucementDelete(ann.id!);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                })}
            </div>
        </main>
    );
}
