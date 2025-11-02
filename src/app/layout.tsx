import type { Metadata } from "next";
import "./globals.css";
import { UIProvider } from "@/context/UIContext";
import Notification from "@/components/Notification";
import Loading from "@/components/Loading";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "e Game Skills",
    description: "e Game Skills",
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                    <UIProvider>
                        <Navbar />
                        <div>
                            <Notification />
                            <Loading />
                            {children}
                        </div>
                    </UIProvider>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
