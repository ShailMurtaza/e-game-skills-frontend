import { Play, Orbitron, Russo_One } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const play = Play({
    subsets: ["latin"],
    weight: ["400", "700"], // optional: choose the weights you need
});

export const metadata: Metadata = {
    title: "e Game Skills",
    description: "e Game Skills",
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const year = new Date().getFullYear();
    return (
        <html lang="en">
            <body>
                <nav
                    className={`${play.className} text-lg font-bold flex flex-row p-7 rounded-b-3xl shadow-[0_4px_30px_rgba(131,206,239,0.7)] bg-black/70 backdrop-blur-md fixed w-full z-10`}
                >
                    <ul className="flex flex-row gap-5">
                        <li>
                            <Link href="/">E Game Skills</Link>
                        </li>
                        <li>
                            <Link href="/">About Us</Link>
                        </li>
                        <li>
                            <Link href="/">Contact Us</Link>
                        </li>
                    </ul>
                    <ul className="flex flex-row gap-5 ml-auto">
                        <li>
                            <button>Sign In</button>
                        </li>
                        <li>
                            <button>Sign Up</button>
                        </li>
                    </ul>
                </nav>
                <div>{children}</div>
                <footer className="mt-5 p-5 text-center">
                    &copy; {year} E Game Skills, all rights reserved.
                </footer>
            </body>
        </html>
    );
}
