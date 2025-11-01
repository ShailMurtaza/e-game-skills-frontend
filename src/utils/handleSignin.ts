"use client";
import { useUI } from "@/context/UIContext";
import { redirectIfAuthenticated } from "./checkLoggedIn";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSignin() {
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

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signin Failed");

            notify("Signin successful", "success");
            redirectIfAuthenticated();
            return { result: true, action: null };
        } catch (err: any) {
            notify(err.message, "error");
            var action = null;
            if (err.message.includes("Verify")) action = "verify";
            return { result: false, action: action };
        } finally {
            setLoading(false);
        }
    }

    return { handleSignin };
}
