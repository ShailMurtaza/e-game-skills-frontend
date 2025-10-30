"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type UIContextType = {
    loading: boolean;
    setLoading: (value: boolean) => void;
    notify: (msg: string, type?: "success" | "error") => void;
    notification: { message: string; type: "success" | "error" } | null;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    function notify(message: string, type: "success" | "error" = "success") {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }

    return (
        <UIContext.Provider
            value={{ loading, setLoading, notify, notification }}
        >
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used within UIProvider");
    return ctx;
};
