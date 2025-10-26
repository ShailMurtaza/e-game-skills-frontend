"use client";
import { useState } from "react";
import { Input, PrimaryBtn } from "@/components/Dashboard";
export default function Users() {
    // Simple mock data generator
    const ROLE = ["player", "team", "admin"];
    const generateUsers = (n = 20) => {
        const users = [];
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
    const [searchEmail, setSearchEmail] = useState("");
    const [searchUsername, setSearchUsername] = useState("");
    const [searchRole, setSearchRole] = useState("");
    const [searchBanned, setSearchBanned] = useState("");
    return (
        <main>
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
                    {users.map((u) => (
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
                                <button className="flex-1 px-2 py-1 rounded bg-gray-800 text-sm">
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

function Pagination({
    page,
    setPage,
    pages,
}: {
    page: number;
    pages: number;
    setPage: () => void;
}) {
    const prev = () => 1;
    const next = () => 3;
    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
                Page {page} of {pages}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={prev}
                    className="px-3 py-1 rounded bg-gray-800 text-sm"
                >
                    Prev
                </button>
                <button
                    onClick={next}
                    className="px-3 py-1 rounded bg-gray-800 text-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
