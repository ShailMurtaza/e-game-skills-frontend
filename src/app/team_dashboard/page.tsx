"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "@/components/Loading";
import { useUI } from "@/context/UIContext";
import UpdateUserProfile from "@/components/UpdateUserProfile";

export default function TeamDashboard() {
    const { setLoading } = useUI();
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
    }, [setLoading]);
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "team"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px] mx-10">
            <div className="border border-white  bg-gray-950">
                <UpdateUserProfile />
            </div>
        </main>
    );
}
