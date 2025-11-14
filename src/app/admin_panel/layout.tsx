"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminPanelNavbar from "@/components/AdminPanelNavbar";
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
        <main className="admin-page pt-[150px] mx-10 min-h-screen flex flex-col p-6 bg-black">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="">Admin Dashboard</h3>
                    <p className="text-sm text-gray-400">{pageTitle}</p>
                </div>
                <AdminPanelNavbar />
            </header>
            <UsersDataProvider>
                <section className="grid grid-1 lg:grid-cols-4 gap-6">
                    <Summary />
                    <div className="lg:col-span-3 p-4 bg-gray-900/40 rounded-lg border border-gray-800">
                        {children}
                    </div>
                </section>
            </UsersDataProvider>
        </main>
    );
}
