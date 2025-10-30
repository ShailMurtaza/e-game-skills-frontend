"use client";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSignup() {
    const { setLoading, notify } = useUI();

    async function handleSignup(
        username: string,
        email: string,
        role: string,
        password: string,
    ) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");

            notify("Signup successful", "success");
            return true;
        } catch (err: any) {
            notify(err.message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { handleSignup };
}
