"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { getAuthData } from "@/utils/authClientData";
import { useRouter, usePathname } from "next/navigation";
import protectedRoutes from "@/lib/ProtectedRoutes";

interface AuthContextType {
    isLoading: boolean;
    isAuthenticated: boolean;
    userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    isAuthenticated: false,
    userRole: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;

        getAuthData()
            .then((data) => {
                if (!mounted) return;

                if (data?.role) {
                    setIsAuthenticated(true);
                    setUserRole(data.role);

                    const rolePaths: Record<string, string> = {
                        team: "/team_dashboard",
                        player: "/player_dashboard",
                        admin: "/admin_panel",
                        pending: "/select_role",
                    };

                    const expectedPath = rolePaths[data.role];
                    if (
                        expectedPath &&
                        !pathname.startsWith(expectedPath) &&
                        protectedRoutes.some((route) =>
                            pathname.startsWith(route),
                        )
                    ) {
                        router.replace(expectedPath);
                    }
                } else {
                    setIsAuthenticated(false);
                    setUserRole(null);
                    // Only redirect to /auth if trying to access protected route
                    if (
                        protectedRoutes.some((route) =>
                            pathname.startsWith(route),
                        )
                    ) {
                        router.replace("/auth");
                    }
                }
                setIsLoading(false);
            })
            .catch(() => {
                if (mounted) {
                    setIsLoading(false);
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            });

        return () => {
            mounted = false;
        };
    }, [router, pathname]);

    return (
        <AuthContext.Provider value={{ isLoading, isAuthenticated, userRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
