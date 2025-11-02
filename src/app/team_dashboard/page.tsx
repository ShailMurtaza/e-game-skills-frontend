"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "@/components/Loading";
import { useUI } from "@/context/UIContext";

export default function TeamDashboard() {
    const { setLoading } = useUI();
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
    }, []);
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "team"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px] mx-10 min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <h1>Team Dashboard</h1>
        </main>
    );
}
