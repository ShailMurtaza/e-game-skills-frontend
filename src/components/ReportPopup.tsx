"use client";
import { useState } from "react";
import { DangerBtn } from "./Dashboard";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportPopup({
    username,
    user_id,
    setReport,
}: {
    username: string;
    user_id: number;
    setReport: (data: any) => void;
}) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const { setLoading, notify } = useUI();

    async function submitReport() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user_id,
                    reason: reason,
                    description: description,
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            notify(data.message);
            setReport(false);
        } catch (e: any) {
            notify(e.message, "error");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-zinc-900 shadow-lg rounded-xl p-6 w-full max-w-md border border-zinc-700">
                <h2 className="text-lg font-semibold mb-4">Report User</h2>

                {/* Username */}
                <label className="text-sm text-zinc-400">Username</label>
                <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full mt-1 mb-3 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
                />

                {/* Reason */}
                <label className="text-sm text-zinc-400">Reason</label>
                <input
                    type="text"
                    placeholder="Reason for report"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full mt-1 mb-3 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg outline-none focus:ring-2 focus:ring-zinc-600"
                />

                {/* Content */}
                <label className="text-sm text-zinc-400">Report Details</label>
                <textarea
                    placeholder="Describe the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 mb-4 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg h-28 outline-none resize-none focus:ring-2 focus:ring-zinc-600 text-sm"
                />

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded-lg transition bg-zinc-700 hover:bg-zinc-600"
                        onClick={() => {
                            setReport(false);
                        }}
                    >
                        Cancel
                    </button>
                    <DangerBtn onClick={submitReport}>Submit</DangerBtn>
                </div>
            </div>
        </div>
    );
}
