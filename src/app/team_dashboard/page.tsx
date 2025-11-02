"use client";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "@/components/Loading";

export default function TeamDashboard() {
    const { isLoading, isAuthenticated, userRole } = useAuth();
    if (isLoading || (!isLoading && !isAuthenticated) || userRole != "team") {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px] mx-10 min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <h1>Team Dashboard</h1>
        </main>
    );
}
