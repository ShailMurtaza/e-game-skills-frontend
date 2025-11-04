"use client";

import { Play } from "next/font/google";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import { LoadingComponent } from "./Loading";
import protectedRoutes from "@/lib/ProtectedRoutes";
import RoleProfilePaths from "@/lib/RoleProfilePaths";

const play = Play({
    subsets: ["latin"],
    weight: ["400", "700"],
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
    const router = useRouter();
    const { setLoading, notify } = useUI();
    const pathname = usePathname();
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    const isOnProtectedRoute = protectedRoutes.some((path) =>
        pathname.startsWith(path),
    );
    const showPublicLinks = !isAuthenticated || !isOnProtectedRoute;

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <nav
            className={`${play.className} text-xl font-bold flex flex-row p-7 rounded-b-3xl shadow-[0_4px_30px_rgba(131,206,239,0.7)] bg-black/70 backdrop-blur-md fixed w-full z-10`}
        >
            <ul className="flex flex-row items-center gap-5">
                <li className="mr-5">
                    <Link href="/">
                        <img src="/icon.svg" width="100" alt="Logo" />
                    </Link>
                </li>
                {showPublicLinks && (
                    <>
                        <li>
                            <Link href="/aboutus">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contactus">Contact Us</Link>
                        </li>
                        <li>
                            <Link href="/services">Services</Link>
                        </li>
                    </>
                )}
            </ul>

            <ul className="flex flex-row items-center gap-5 ml-auto">
                {isAuthenticated && userProfile?.role === "team" && (
                    <li>
                        <Link href="/search">
                            <button>Search</button>
                        </Link>
                    </li>
                )}

                {isAuthenticated &&
                    (userProfile?.role === "team" ||
                        userProfile?.role === "player") && (
                        <li>
                            <Link href="/messages">
                                <button>Messages</button>
                            </Link>
                        </li>
                    )}

                <li>
                    <Link href="/announcements">
                        <button>Announcements</button>
                    </Link>
                </li>

                {isAuthenticated && userProfile?.role && (
                    <li>
                        <Link href={RoleProfilePaths[userProfile?.role]}>
                            <button>Profile</button>
                        </Link>
                    </li>
                )}

                {!isAuthenticated ? (
                    <>
                        <li>
                            <Link href="/auth?action=signin">
                                <button>Sign In</button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth?action=signup">
                                <button>Sign Up</button>
                            </Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link href="#">
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const res = await fetch(
                                            `${API_URL}/auth/logout`,
                                            {
                                                method: "GET",
                                                credentials: "include",
                                            },
                                        );
                                        if (!res.ok) {
                                            throw new Error(
                                                "Something went wrong",
                                            );
                                        } else {
                                            notify("Logged Out", "success");
                                        }
                                    } catch (e) {
                                        notify("Something went wrong", "error");
                                        console.error(e);
                                    } finally {
                                        router.replace("/auth");
                                    }
                                }}
                            >
                                Logout
                            </button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
