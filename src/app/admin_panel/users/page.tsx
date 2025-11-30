"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Input, PrimaryBtn } from "@/components/Dashboard";
import Pagination from "@/components/AdminPanel/Pagination";
import UserEditor from "@/components/AdminPanel/UserEditor";
import { User, UserSearchFilters } from "@/lib/User";
import { useUI } from "@/context/UIContext";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Users() {
    const router = useRouter();
    const { setLoading, notify } = useUI();
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page") ?? "1";
    const [maxPages, setMaxPages] = useState<number>(1);
    const [users, setUsers] = useState<User[]>([]);
    const [searchEmail, setSearchEmail] = useState<string>("");
    const [searchUsername, setSearchUsername] = useState<string>("");
    const [searchRole, setSearchRole] = useState<string>("all");
    const [searchBanned, setSearchBanned] = useState<string>("all");

    // Index user from users array not the user.id
    const [showUserEditor, setShowUserEditor] = useState<number | null>(null);
    async function fetchUsers(page: number = 1) {
        setLoading(true);
        const searchData: UserSearchFilters = {};
        setSearchEmail(searchEmail.trim());
        setSearchUsername(searchUsername.trim());
        if (searchEmail.length) searchData["email"] = searchEmail;
        if (searchUsername.length) searchData["username"] = searchUsername;
        if (searchRole !== "all") searchData["role"] = searchRole;
        if (searchBanned !== "all")
            searchData["banned"] = searchBanned === "true";
        try {
            const res = await fetch(`${API_URL}/admin/users?page=${page}`, {
                body: JSON.stringify(searchData),
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setUsers(data.users);
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
        fetchUsers(Number(pageNumber));
    }, [pageNumber]);
    return (
        <main>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showUserEditor !== null ? (
                    <UserEditor
                        user={users[showUserEditor]}
                        setShowUserEditor={setShowUserEditor}
                        setUser={(updated_user: User) => {
                            const updatedUsers = users.map((user) => {
                                return user.id === updated_user.id
                                    ? updated_user
                                    : user;
                            });
                            setUsers(updatedUsers);
                        }}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            <h4>Users</h4>
            <div className="mt-4">
                {/* Searching Containaer */}
                <div className="flex flex-col lg:flex-row lg:gap-10 gap-5">
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
                    <PrimaryBtn
                        text="Search"
                        onClick={() => {
                            if (Number(pageNumber) !== 1) {
                                // Updating query will cause fetchUser and automatic search
                                router.push("?page=1");
                            } else {
                                // If pageNumber is already 1 then fetch users
                                fetchUsers();
                            }
                        }}
                    />
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
                                        setShowUserEditor(index);
                                    }}
                                >
                                    Open
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
