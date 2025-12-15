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
import RoleProfilePaths from "@/lib/RoleProfilePaths";
import { UserProfile } from "@/lib/User";

type AuthContextType = {
    isLoading: boolean;
    isAuthenticated: boolean;
    userProfile: UserProfile | null;
};

const AuthContext = createContext<AuthContextType>({
    isLoading: true,
    isAuthenticated: false,
    userProfile: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        let mounted = true;

        getAuthData()
            .then((data) => {
                if (!mounted) return;

                if (data?.role) {
                    setIsAuthenticated(true);
                    setUserProfile(data);

                    const expectedPath = RoleProfilePaths[data.role];
                    if (
                        !pathname.startsWith("/messages") &&
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
                    setUserProfile(null);
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
                    if (
                        !pathname.startsWith("/auth") &&
                        protectedRoutes.some((route) =>
                            pathname.startsWith(route),
                        )
                    ) {
                        console.log("Route is protected");
                        router.replace("/auth");
                    }
                    setIsLoading(false);
                    setIsAuthenticated(false);
                    setUserProfile(null);
                }
            });

        return () => {
            mounted = false;
        };
    }, [router, pathname]);

    return (
        <AuthContext.Provider
            value={{ isLoading, isAuthenticated, userProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
