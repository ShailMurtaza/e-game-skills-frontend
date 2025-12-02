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
            <div className="fixed inset-0 flex justify-start items-start w-full h-full z-40 bg-black">
                <div className="w-10/12 max-w-3xl p-6 bg-gray-900 rounded-none border border-red-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="text-sm text-blue-800">
                            Username
                            <input
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full mt-2 bg-green-100 px-3 py-1 text-base outline-none"
                            />
                        </label>
                        <label className="text-sm text-red-700">
                            Email
                            <input
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="w-full mt-2 bg-purple-100 px-3 py-1 text-base outline-none"
                            />
                        </label>
                        <label className="text-sm text-orange-700">
                            Role
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role: e.target.value as User["role"],
                                    })
                                }
                                className="w-full mt-2 bg-blue-100 px-3 py-1 text-base outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="player">Player</option>
                                <option value="team">Team</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <label className="text-sm text-purple-800">
                            Banned
                            <select
                                value={String(form.banned)}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        banned: e.target.value === "true",
                                    })
                                }
                                className="w-full mt-2 bg-pink-100 px-3 py-1 text-base outline-none"
                            >
                                <option value="false">Un-banned</option>
                                <option value="true">Banned</option>
                            </select>
                        </label>
                        <label className="text-sm text-green-800 col-span-1 md:col-span-2">
                            Notes
                            <textarea
                                value={form?.notes || ""}
                                onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                }
                                className="w-full mt-2 bg-orange-100 px-3 py-1 text-base outline-none"
                                rows={3}
                            />
                        </label>
                    </div>
                    <div className="mt-6 flex flex-row gap-3">
                        <Button
                            label="Open Portfolio"
                            variant="neutral"
                            className="w-full bg-red-300 text-black"
                            onClick={() => {
                                window.open(`/portfolio/${form.id}`, "_blank");
                            }}
                        />
                        <Button
                            label="Message User"
                            variant="neutral"
                            className="w-full bg-red-300 text-black"
                            onClick={() => {
                                window.open(
                                    `/messages?user=${form.id}`,
                                    "_blank",
                                );
                            }}
                        />
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button
                            label="Save"
                            variant="primary"
                            className="bg-blue-400 text-white"
                            onClick={updateUser}
                        />
                        <Button
                            label="Close"
                            variant="neutral"
                            className="bg-red-400 text-black"
                            onClick={() => {
                                setShowUserEditor(null);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
