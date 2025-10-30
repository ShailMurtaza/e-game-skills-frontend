"use client";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useGenerateOtp() {
    const { setLoading, notify } = useUI();

    async function handleGenerateOtp(email: string) {
        setLoading(true);
        try {
            if (!email) throw new Error("Enter Email");
            const res = await fetch(`${API_URL}/users/generate-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");

            notify("Enter code sent to your Email", "success");
            return true;
        } catch (err: any) {
            notify(err.message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { handleGenerateOtp };
}
