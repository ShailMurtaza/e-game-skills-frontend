// Users Data context provider to share users data with layout and page of admin panel
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUI } from "./UIContext";

type UserCountData = {
    by_role: Record<string, number>;
    banned: number;
    total: number;
};

const UsersDataContext = createContext<UserCountData | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function UsersDataProvider({ children }: { children: React.ReactNode }) {
    const [usersCount, setUsersCount] = useState<UserCountData | null>(null);
    const { setLoading, notify } = useUI();
    // Fetch number of users
    useEffect(() => {
        async function fetch_user_count() {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/admin/user_count`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                setUsersCount(data);
            } catch (e: any) {
                notify(e.message, "error");
            } finally {
                setLoading(false);
            }
        }
        fetch_user_count();
    }, []);
    return (
        <UsersDataContext.Provider value={usersCount}>
            {children}
        </UsersDataContext.Provider>
    );
}

export function useUsersData() {
    return useContext(UsersDataContext);
}
