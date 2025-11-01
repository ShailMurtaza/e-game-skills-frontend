"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuthData } from "./authClientData";

export function useRequireAuth() {
    const router = useRouter();

    useEffect(() => {
        getAuthData().then((data) => {
            if (!data) {
                router.push("/auth?action=signin");
            }
        });
    }, [router]);
}
