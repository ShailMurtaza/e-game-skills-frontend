"use client";
import { useState } from "react";
import { DangerBtn } from "./Dashboard";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportPopup({
    username,
    user_id,
    setReportAction,
}: {
    username: string;
    user_id: number;
    setReportAction: (data: boolean) => void;
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
            setReportAction(false);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            notify(message, "error");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-300/20 flex items-start justify-center z-20 p-10">
            <div className="bg-yellow-200 border border-red-500 p-3 w-full max-w-md rounded-none shadow-sm">
                <h2 className="text-lg font-normal mb-2 text-blue-700">
                    Report User
                </h2>

                {/* Username */}
                <label className="text-sm text-green-700">Username</label>
                <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full mt-1 mb-2 px-2 py-2 bg-pink-100 border border-orange-500 text-purple-700 cursor-not-allowed"
                />

                {/* Reason */}
                <label className="text-sm text-red-700">Reason</label>
                <input
                    type="text"
                    placeholder="Reason for report"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full mt-1 mb-2 px-2 py-2 bg-green-100 border border-purple-500 outline-none text-blue-900"
                />

                {/* Content */}
                <label className="text-sm text-orange-700">
                    Report Details
                </label>
                <textarea
                    placeholder="Describe the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 mb-3 px-2 py-2 bg-pink-200 border border-green-500 h-28 outline-none resize-none text-purple-900 text-sm"
                />

                {/* Actions */}
                <div className="flex justify-start gap-2">
                    <button
                        className="px-3 py-1 rounded-none bg-blue-200 text-red-700"
                        onClick={() => {
                            setReportAction(false);
                        }}
                    >
                        Cancel
                    </button>
                    <DangerBtn
                        onClick={submitReport}
                        className="bg-red-300 text-purple-900"
                    >
                        Submit
                    </DangerBtn>
                </div>
            </div>
        </div>
    );
}
