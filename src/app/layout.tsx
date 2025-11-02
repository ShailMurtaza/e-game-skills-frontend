import { Play } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import Notification from "@/components/Notification";
import Loading from "@/components/Loading";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/Navbar";

const play = Play({
    subsets: ["latin"],
    weight: ["400", "700"],
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
            <head>
                <link
                    rel="icon"
                    href="/icon.svg"
                    type="image/svg"
                    sizes="any"
                />
            </head>
            <body>
                <AuthProvider>
                    <Navbar />
                    <div>
                        <UIProvider>
                            <Notification />
                            <Loading />
                            {children}
                        </UIProvider>
                    </div>
                    <footer className="mt-5 p-5 text-center">
                        &copy; {year} E Game Skills, all rights reserved.
                    </footer>
                </AuthProvider>
            </body>
        </html>
    );
}
