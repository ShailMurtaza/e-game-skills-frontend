"use client";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function useRecoverAccount() {
    const { setLoading, notify } = useUI();

    async function handleRecoverAccount(
        email: string,
        otp: string,
        password: string,
    ) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");

            notify("Password Recovered", "success");
            return true;
        } catch (err: any) {
            notify(err.message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { handleRecoverAccount };
}
