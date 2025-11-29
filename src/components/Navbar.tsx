"use client";

import { Play } from "next/font/google";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import { LoadingComponent } from "./Loading";
import protectedRoutes from "@/lib/ProtectedRoutes";
import RoleProfilePaths from "@/lib/RoleProfilePaths";
import { useEffect, useState } from "react";
import { useMessageProvider } from "@/context/messagesContext";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

const play = Play({
    subsets: ["latin"],
    weight: ["400", "700"],
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
    const router = useRouter();
    const { setLoading, notify } = useUI();
    const { unreadMsgCount } = useMessageProvider();
    const [unreadMsgCountNum, setUnreadMsgCountNum] = useState<number>(0);
    const [navOpen, setNavOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    const isOnProtectedRoute = protectedRoutes.some((path) =>
        pathname.startsWith(path),
    );

    useEffect(() => {
        let unread_msgs = 0;
        unreadMsgCount.forEach((item) => (unread_msgs += item.unreadMsgs));
        setUnreadMsgCountNum(unread_msgs);
    }, [unreadMsgCount]);
    const showPublicLinks = !isAuthenticated || !isOnProtectedRoute;
    function MenuItems({ smallNav }: { smallNav: boolean }) {
        return (
            <div
                className={`${smallNav ? "lg:hidden flex" : "hidden lg:flex"} lg:flex-row flex-col gap-5 justify-between w-full`}
                onClick={() => {
                    setNavOpen(false);
                }}
            >
                {showPublicLinks && (
                    <ul className="flex lg:flex-row flex-col items-center gap-5">
                        <li>
                            <Link href="/aboutus">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contactus">Contact Us</Link>
                        </li>
                        <li>
                            <Link href="/services">Services</Link>
                        </li>
                    </ul>
                )}

                <ul className="flex flex-col lg:flex-row items-center gap-5 ml-auto">
                    {isAuthenticated && userProfile?.role === "team" && (
                        <li>
                            <Link href="/search">
                                <button>Search</button>
                            </Link>
                        </li>
                    )}

                    {isAuthenticated && userProfile?.role !== "pending" && (
                        <li>
                            <Link href="/messages">
                                <button className="relative">
                                    Messages
                                    {unreadMsgCountNum > 0 && (
                                        <div className="absolute -top-4 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                            {unreadMsgCountNum > 99
                                                ? "99+"
                                                : unreadMsgCountNum}
                                        </div>
                                    )}
                                </button>
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
                                            notify(
                                                "Something went wrong",
                                                "error",
                                            );
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
            </div>
        );
    }

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <nav
            className={`${play.className} text-xl font-bold flex lg:flex-row lg:gap-0 flex-col items-center h-fit lg:p-7 py-7 px-1 rounded-b-3xl shadow-[0_4px_30px_rgba(131,206,239,0.7)] bg-black/70 backdrop-blur-md fixed w-full z-10`}
        >
            <section className="lg:block lg:w-fit w-full flex flex-row justify-between items-center mr-5">
                <Link href="/" className="lg:m-0 ml-10 mt-2">
                    <img src="/icon.svg" width="100" alt="Logo" />
                </Link>
                {navOpen ? (
                    <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="lg:hidden"
                        onClick={() => setNavOpen((p) => !p)}
                    >
                        <RxCross1 size={35} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="hamburger"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="lg:hidden"
                        onClick={() => setNavOpen((p) => !p)}
                    >
                        <RxHamburgerMenu size={35} />
                    </motion.div>
                )}
            </section>

            <section className="w-full">
                <MenuItems smallNav={false} />
            </section>
            <AnimatePresence>
                {navOpen && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MenuItems smallNav={true} />
                    </motion.section>
                )}
            </AnimatePresence>
        </nav>
    );
}
