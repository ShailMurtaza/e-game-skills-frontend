"use client";

import { Play } from "next/font/google";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "./Loading";
import protectedRoutes from "@/lib/ProtectedRoutes";
import { usePathname } from "next/navigation";

const play = Play({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Navbar() {
    const pathname = usePathname();
    const { isLoading, isAuthenticated, userRole } = useAuth();
    const isOnProtectedRoute = protectedRoutes.some((path) =>
        pathname.startsWith(path),
    );
    const showPublicLinks = !isAuthenticated || !isOnProtectedRoute;

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <nav
            className={`${play.className} text-lg font-bold flex flex-row p-7 rounded-b-3xl shadow-[0_4px_30px_rgba(131,206,239,0.7)] bg-black/70 backdrop-blur-md fixed w-full z-10`}
        >
            <ul className="flex flex-row items-center gap-5">
                <li>
                    <Link href="/">
                        <img src="/icon.svg" width="70" alt="Logo" />
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
                    </>
                )}
            </ul>

            <ul className="flex flex-row items-center gap-5 ml-auto">
                {isAuthenticated && userRole === "team" && (
                    <li>
                        <Link href="/search">
                            <button>Search</button>
                        </Link>
                    </li>
                )}

                {isAuthenticated &&
                    (userRole === "team" || userRole === "player") && (
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
                            <button onClick={() => {}}>Logout</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
