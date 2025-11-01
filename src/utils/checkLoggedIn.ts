import { User } from "@/lib/User";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getClientData() {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        console.log(data);
        return data;
    } catch (err: any) {
        return false;
    }
}

export function requireAuth() {}

export async function redirectIfAuthenticated() {
    const paths = {
        team: "team_dashboard",
        player: "player_dashboard",
        admin: "admin_panel",
        pending: "select_role",
    };
    const data = await getClientData();

    if (data.role) {
        const path = paths[data.role as User["role"]];
        window.location.href = "/" + path;
    }
}
