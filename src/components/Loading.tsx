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
                <div className=""></div>
                <div className="absolute">Loading...</div>
            </div>
        </main>
    );
}
