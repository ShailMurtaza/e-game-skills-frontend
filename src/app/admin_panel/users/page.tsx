"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, PrimaryBtn } from "@/components/Dashboard";
import Overlay from "@/components/Overlay";
import Pagination from "@/components/Pagination";
import { User } from "@/lib/User";

export default function Users() {
    // Simple mock data generator
    const ROLE = ["player", "team", "admin"] as const;
    const generateUsers = (n = 20) => {
        const users: User[] = [];
        for (let i = 1; i <= n; i++) {
            const role = ROLE[Math.floor(Math.random() * ROLE.length)];
            const banned = Math.random() < 0.08;
            users.push({
                id: i,
                username: `user${i}`,
                email: `user${i}@example.com`,
                role,
                isAdmin: role === "admin",
                banned,
                notes: "",
                createdAt: new Date(
                    Date.now() - Math.floor(Math.random() * 10000000000),
                ).toISOString(),
            });
        }
        return users;
    };
    const users = generateUsers();
    const [searchEmail, setSearchEmail] = useState<string>("");
    const [searchUsername, setSearchUsername] = useState<string>("");
    const [searchRole, setSearchRole] = useState<string>("");
    const [searchBanned, setSearchBanned] = useState<string>("");

    const [showUserEditor, setShowUserEditor] = useState<User | null>(null);
    return (
        <main>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showUserEditor !== null ? (
                    <UserDetailEditor
                        user={showUserEditor}
                        setShowUserEditor={setShowUserEditor}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            <h4>Users</h4>
            <div className="mt-4">
                {/* Searching Containaer */}
                <div className="flex flex-row gap-10">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={searchEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchEmail(e.target.value);
                        }}
                    />
                    <Input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={searchUsername}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchUsername(e.target.value);
                        }}
                    />
                    <select
                        className="bg-gray-800 p-5 rounded outline-none"
                        value={searchRole}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setSearchRole(e.target.value);
                        }}
                    >
                        <option value="all">All roles</option>
                        <option value="player">Player</option>
                        <option value="team">Team</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="bg-gray-800 p-5 rounded outline-none"
                        value={searchBanned}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setSearchBanned(e.target.value);
                        }}
                    >
                        <option value="all">All status</option>
                        <option value="true">Banned</option>
                        <option value="false">Un-banned</option>
                    </select>
                    <PrimaryBtn text="Search" />
                </div>

                {/* Users List */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((u, index) => (
                        <div
                            key={u.id}
                            className="p-3 bg-gray-850 rounded border border-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-white">
                                        {u.username}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {u.email}
                                    </div>
                                </div>
                                <div className="text-right text-xs">
                                    <div className="capitalize">{u.role}</div>
                                    <div
                                        className={`mt-1 text-xs ${u.banned ? "text-red-400" : "text-green-400"}`}
                                    >
                                        {u.banned ? "BANNED" : "ACTIVE"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                                <button
                                    className="flex-1 px-2 py-1 rounded bg-gray-800 text-sm"
                                    onClick={() => {
                                        setShowUserEditor(users[index]);
                                    }}
                                >
                                    Open
                                </button>
                                <button className="px-2 py-1 rounded bg-red-700 text-sm">
                                    {u.banned ? "Unban" : "Ban"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination page={2} pages={10} setPage={() => {}} />
            </div>
        </main>
    );
}

function UserDetailEditor({
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
            <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full z-30">
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
