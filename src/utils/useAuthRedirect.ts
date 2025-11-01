"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthData } from "./authClientData";

// Custom hook that returns auth status + loading
export default function useAuthRedirect() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        getAuthData()
            .then((data) => {
                if (!mounted) return;

                if (data?.role) {
                    const paths: Record<string, string> = {
                        team: "team_dashboard",
                        player: "player_dashboard",
                        admin: "admin_panel",
                        pending: "select_role",
                    };
                    const path = paths[data.role];
                    if (path) {
                        setRedirectPath(`/${path}`);
                        setIsAuthenticated(true);
                    }
                }
                setIsLoading(false);
            })
            .catch(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [router]);

    // Perform redirect only when ready
    useEffect(() => {
        if (redirectPath) {
            router.replace(redirectPath); // use `replace` to avoid back-button issues
        } else {
            router.replace("/auth");
        }
    }, [redirectPath, router]);

    return { isLoading, isAuthenticated };
}
