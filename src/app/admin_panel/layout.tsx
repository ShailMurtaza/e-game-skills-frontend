"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminPanelNavbar from "@/components/AdminPanel/Navbar";
import { UsersDataProvider } from "@/context/UsersData";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "@/components/Loading";
import { useUI } from "@/context/UIContext";
import Summary from "@/components/AdminPanel/Summary";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { setLoading } = useUI();
    const pathname = usePathname();
    const [pageTitle, setPageTitle] = useState("");
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
        // extract the last segment and capitalize
        const segment =
            pathname
                .replace("admin_panel", "")
                .split("/")
                .filter(Boolean)
                .pop() || "Summary";
        setPageTitle(segment.charAt(0).toUpperCase() + segment.slice(1));
    }, [pathname]);

    const { isLoading, isAuthenticated, userProfile } = useAuth();
    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "admin"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="admin-page pt-[150px] lg:mx-10 mx-3 min-h-screen flex flex-col p-6 bg-gray-950 text-purple-300">
            <header className="flex lg:items-start lg:justify-start flex-col lg:flex-row gap-3 mb-4 w-full bg-yellow-400 p-2 border-2 border-red-500">
                <div>
                    <h3 className="text-blue-700 font-normal text-lg">
                        Admin Dashboard
                    </h3>
                    <p className="text-sm text-orange-700">{pageTitle}</p>
                </div>
                <AdminPanelNavbar />
            </header>
            <UsersDataProvider>
                <section className="grid grid-1 lg:grid-cols-4 gap-4">
                    <Summary />
                    <div className="lg:col-span-3 p-4 bg-green-100/50 rounded-none border border-purple-500">
                        {children}
                    </div>
                </section>
            </UsersDataProvider>
        </main>
    );
}
