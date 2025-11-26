"use client";
import Button from "@/components/AdminPanel/Buttons";
import Pagination from "@/components/AdminPanel/Pagination";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useUI } from "@/context/UIContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContactMessage } from "@/lib/ContactMessage";
import { AnimatePresence } from "framer-motion";
import ContactMessageViewer from "@/components/AdminPanel/ContactMessageViewer";
import formatDate from "@/lib/FormatDate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function ContactsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [showContactMessage, setShowContactMessage] =
        useState<ContactMessage | null>(null);
    const [maxPages, setMaxPages] = useState<number>(1);
    const pageNumber = searchParams.get("page") ?? "1";
    const [contactDelete, setContactDelete] = useState<number | null>(null);
    const { setLoading, notify } = useUI();
    async function deleteContact(id: number) {}
    async function fetchContacts(page: number = 1) {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/contacts?page=${page}`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setContacts(
                data.contacts.map(
                    (c: ContactMessage) =>
                        ({
                            ...c,
                            timestamp: new Date(c.timestamp),
                        }) as ContactMessage,
                ),
            );
            setMaxPages(data.max_pages);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchContacts(Number(pageNumber));
    }, [pageNumber]);
    return (
        <main>
            {/* Contact Message Viewer */}
            <AnimatePresence mode="wait">
                {showContactMessage !== null ? (
                    <ContactMessageViewer
                        contactMessage={showContactMessage}
                        CloseAction={() => {
                            setShowContactMessage(null);
                        }}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            {contactDelete && (
                <DeleteConfirmDialog
                    onCancel={() => {
                        setContactDelete(null);
                    }}
                    onDelete={() => {
                        deleteContact(contactDelete);
                    }}
                />
            )}
            <h4>Contacts</h4>
            <div className="mt-5 grid grid-cols-1 gap-3">
                {contacts.map((c) => {
                    return (
                        <div
                            className="p-3 bg-gray-850 rounded border border-gray-800 flex flex-row justify-between"
                            key={c.id}
                        >
                            <div>
                                <div className="text-sm text-white">
                                    {c.email}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {formatDate(c.timestamp)}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    label="View"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowContactMessage(c);
                                    }}
                                />
                                <Button
                                    label="Delete"
                                    variant="danger"
                                    onClick={() => {
                                        setContactDelete(c.id);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                <Pagination
                    page={Number(pageNumber)}
                    pages={maxPages}
                    setPage={(page: number) => {
                        if (page !== Number(pageNumber))
                            router.push(`?page=${page}`);
                    }}
                />
            </div>
        </main>
    );
}
