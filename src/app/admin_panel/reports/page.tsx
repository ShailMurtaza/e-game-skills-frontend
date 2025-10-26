"use client";
import Pagination from "@/components/Pagination";
import { Report } from "@/lib/Report";
import ReportViewer from "@/components/ReportViewer";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Reports() {
    // Reports mock
    function createReports() {
        const report_resons = ["spam", "abuse", "impersonation"] as const;
        const r: Report[] = [];
        for (let i = 1; i <= 34; i++) {
            r.push({
                id: i,
                reporterId: Math.ceil(Math.random() * 200),
                targetId: Math.ceil(Math.random() * 250),
                reason: report_resons[Math.floor(Math.random() * 3)],
                note: "The user sent an offensive and disrespectful message directed at another participant. The content contained personal insults, inappropriate language, and behavior that promotes hostility. Such communication creates an uncomfortable environment and goes against the platform’s community standards. It is recommended that the message be reviewed and appropriate action be taken to maintain a respectful and safe space for all users.",
                createdAt: new Date(Date.now() - i * 10000000).toISOString(),
            });
        }
        return r;
    }
    const reports = createReports();
    const [showReportViewer, setShowReportViewer] = useState<Report | null>(
        null,
    );
    return (
        <main>
            {/* Reports Viewer */}
            <AnimatePresence mode="wait">
                {showReportViewer !== null ? (
                    <ReportViewer
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
            <div className="mt-5 space-y-3">
                {reports.map((r) => (
                    <div
                        key={r.id}
                        className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between items-start"
                    >
                        <div>
                            <div className="text-sm text-white">
                                Report #{r.id} — {r.reason}
                            </div>
                            <div className="text-xs text-gray-400">
                                Reporter: {r.reporterId} · Target: {r.targetId}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(r.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="px-2 py-1 rounded bg-gray-800 text-sm"
                                onClick={() => {
                                    setShowReportViewer(r);
                                }}
                            >
                                View
                            </button>
                            <button className="px-2 py-1 rounded bg-red-800 text-sm">
                                Resolved
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination page={1} pages={2} setPage={() => {}} />
        </main>
    );
}
