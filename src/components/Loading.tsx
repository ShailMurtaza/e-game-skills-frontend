"use client";
import { useUI } from "@/context/UIContext";

export default function Loading() {
    const { loading } = useUI();
    if (!loading) return null;
    return <LoadingComponent />;
}

export function LoadingComponent() {
    return (
        <main className="">
            <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black/50 z-50 select-none">
                <div className="animate-spin rounded-full h-45 w-45 border-t-10 border-b-10 border-blue-500"></div>
                <div className="absolute">Loading...</div>
            </div>
        </main>
    );
}
