"use client";
import { useUI } from "@/context/UIContext";
import { useRouter } from "next/navigation";
import { getAuthData } from "./authClientData";
import RoleProfilePaths from "@/lib/RoleProfilePaths";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSignin() {
    const router = useRouter();
    const { setLoading, notify } = useUI();

    async function handleSignin(email: string, password: string) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const loginData = await res.json();
            if (!res.ok) throw new Error(loginData.message || "Signin Failed");

            const userData = await getAuthData();

            if (userData.role) {
                // 3. Redirect based on role
                const path = RoleProfilePaths[userData.role];
                if (path) {
                    notify("Signin successful", "success");
                    router.push(path);
                } else {
                    notify("Unknown role", "error");
                }
            }
            return { result: true, action: null };
        } catch (err: any) {
            notify(err.message, "error");
            setLoading(false);
            var action = null;
            if (err.message.includes("Verify")) action = "verify";
            return { result: false, action: action };
        }
    }

    return { handleSignin };
}
