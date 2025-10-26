"use client";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { motion } from "framer-motion";
import { User } from "@/lib/User";

export default function UserEditor({
    user,
    setShowUserEditor,
}: {
    user: User;
    setShowUserEditor: (data: User | null) => void;
}) {
    const [form, setForm] = useState<User>({ ...user });

    useEffect(() => setForm({ ...user }), [user]);

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
                                        role: e.target.value,
                                        isAdmin: e.target.value === "admin",
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            >
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
                                value={form.notes}
                                onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                                rows={3}
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button className="px-3 py-2 rounded bg-green-700 text-sm">
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowUserEditor(null);
                            }}
                            className="px-3 py-2 rounded bg-gray-800 text-sm"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
