"use client";
import { useUI } from "@/context/UIContext";

export default function Loading() {
    const { loading } = useUI();
    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-white text-lg z-50">
            Loading...
        </div>
    );
}
