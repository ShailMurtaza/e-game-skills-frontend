"use client";
import { AIReport } from "@/lib/AIReport";
import AIReportViewer from "@/components/AIReportViewer";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function generateReports() {
    const severity = ["low", "medium", "high"] as const;
    const a: AIReport[] = [];
    for (let i = 1; i <= 18; i++) {
        a.push({
            id: i,
            targetId: Math.ceil(Math.random() * 250),
            severity: severity[Math.floor(Math.random() * 3)],
            note: "Auto-detected inappropriate message snippet...",
            createdAt: new Date(Date.now() - i * 20000000).toISOString(),
        });
    }
    return a;
}

export default function AIReports() {
    const aiReports = generateReports();
    const [showReportViewer, setShowReportViewer] = useState<AIReport | null>(
        null,
    );
    return (
        <main>
            {/* Reports Viewer */}
            <AnimatePresence mode="wait">
                {showReportViewer !== null ? (
                    <AIReportViewer
                        report={showReportViewer}
                        CloseAction={() => {
                            setShowReportViewer(null);
                        }}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            <h4>Reports by Users</h4>
            <div className="mt-5 grid grid-cols-1 gap-3">
                {aiReports.map((a) => (
                    <div
                        key={a.id}
                        className="p-3 bg-gray-850 rounded border border-gray-800"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm text-white">
                                    AutoReport #{a.id} · Severity: {a.severity}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Target: {a.targetId} ·{" "}
                                    {new Date(a.createdAt).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {a.note}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-2 py-1 rounded bg-gray-800 text-sm"
                                    onClick={() => {
                                        setShowReportViewer(a);
                                    }}
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
