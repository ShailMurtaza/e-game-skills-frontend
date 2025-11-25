"use client";
import Pagination from "@/components/AdminPanel/Pagination";
import { Report } from "@/lib/Report";
import ReportViewer from "@/components/AdminPanel/ReportViewer";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useSearchParams, useRouter } from "next/navigation";
import { PrimaryBtn } from "@/components/Dashboard";

export default function Reports() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page") ?? "1";
    const [maxPages, setMaxPages] = useState<number>(1);
    const [reports, setReports] = useState<Report[]>([]);
    const [searchReviewed, setSerachReviewed] = useState<string>("all");
    const { setLoading, notify } = useUI();
    const [showReportViewer, setShowReportViewer] = useState<Report | null>(
        null,
    );
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    async function fetchReports(page: number = 1) {
        try {
            setLoading(true);
            const searchData: Record<string, any> = {};
            if (searchReviewed !== "all")
                searchData["is_reviewed"] = searchReviewed === "true";
            const res = await fetch(
                `${API_URL}/reports/getReports?page=${page}`,
                {
                    method: "POST",
                    body: JSON.stringify(searchData),
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                },
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setReports(
                data.reports.map(
                    (item: Report) =>
                        ({
                            ...item,
                            timestamp: new Date(item.timestamp),
                        }) as Report,
                ),
            );
            console.log(data);
            setMaxPages(data.max_pages);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchReports(Number(pageNumber));
    }, [pageNumber]);
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
            <div className="mt-5 flex flex-row gap-5">
                <select
                    className="bg-gray-800 p-5 rounded outline-none"
                    value={searchReviewed}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSerachReviewed(e.target.value);
                    }}
                >
                    <option value="all">All Reports</option>
                    <option value="true">Reviewed</option>
                    <option value="false">Not Reviewed</option>
                </select>
                <PrimaryBtn
                    text="Search"
                    onClick={() => {
                        if (Number(pageNumber) !== 1) {
                            // Updating query will cause fetchReports and automatic search
                            router.push("?page=1");
                        } else {
                            // If pageNumber is already 1 then fetch reports
                            fetchReports();
                        }
                    }}
                />
            </div>
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
                                Reporter: {r.reporter_id} · Target:{" "}
                                {r.target_id}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(r.timestamp).toLocaleString()}
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
                            <button
                                className={`px-2 py-1 rounded text-sm ${r.is_reviewed ? "bg-green-800" : "bg-red-800"}`}
                            >
                                {r.is_reviewed ? "Reviewed" : "Not Reviewed"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                page={Number(pageNumber)}
                pages={maxPages}
                setPage={(page: number) => {
                    if (page !== Number(pageNumber))
                        router.push(`?page=${page}`);
                }}
            />
        </main>
    );
}
