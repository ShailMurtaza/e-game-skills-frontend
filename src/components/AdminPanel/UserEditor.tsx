"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "@/lib/User";
import { useUI } from "@/context/UIContext";
import Button from "./Buttons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function UserEditor({
    user,
    setShowUserEditor,
    setUser,
}: {
    user: User;
    setShowUserEditor: (data: number | null) => void;
    setUser: (data: User) => void;
}) {
    const [form, setForm] = useState<User>({ ...user });
    const { setLoading, notify } = useUI();

    async function updateUser() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/user/update`, {
                body: JSON.stringify(form),
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setUser(form);
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
            <div className="fixed inset-0 flex justify-center items-center w-full h-full z-40 bg-black/80">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="text-xs text-gray-400">
                            Username
                            <input
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>
                        <label className="text-xs text-gray-400">
                            Email
                            <input
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>
                        <label className="text-xs text-gray-400">
                            Role
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role: e.target.value as User["role"],
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="player">Player</option>
                                <option value="team">Team</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <label className="text-xs text-gray-400">
                            Banned
                            <select
                                value={String(form.banned)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        banned: e.target.value === "true",
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            >
                                <option value="false">Un-banned</option>
                                <option value="true">Banned</option>
                            </select>
                        </label>
                        <label className="text-xs text-gray-400 col-span-1 md:col-span-2">
                            Notes
                            <textarea
                                value={form?.notes || ""}
                                onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                                rows={3}
                            />
                        </label>
                    </div>
                    <div className="mt-4 flex flex-row gap-2">
                        <Button
                            label="Open Portfolio"
                            variant="neutral"
                            className="w-full"
                            onClick={() => {
                                window.open(`/portfolio/${form.id}`, "_blank");
                            }}
                        />
                        <Button
                            label="Message User"
                            variant="neutral"
                            className="w-full"
                            onClick={() => {
                                window.open(
                                    `/messages?user=${form.id}`,
                                    "_blank",
                                );
                            }}
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            label="Save"
                            variant="primary"
                            onClick={updateUser}
                        />
                        <Button
                            label="Close"
                            variant="neutral"
                            onClick={() => {
                                setShowUserEditor(null);
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
