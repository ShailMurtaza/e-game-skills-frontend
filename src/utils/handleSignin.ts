"use client";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useSignin() {
    const { setLoading, notify } = useUI();

    async function handleSignin(email: string, password: string) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signin Failed");

            localStorage.setItem("JWT", data.accessToken);
            notify("Signin successful", "success");
            return true;
        } catch (err: any) {
            notify(err.message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { handleSignin };
}
