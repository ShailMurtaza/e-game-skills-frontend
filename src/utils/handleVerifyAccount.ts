"use client";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useVerifyAccount() {
    const { setLoading, notify } = useUI();

    async function handleVerifyAccount(email: string, otp: string) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");

            notify("Your account is verified", "success");
            return true;
        } catch (err: any) {
            notify(err.message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { handleVerifyAccount };
}
