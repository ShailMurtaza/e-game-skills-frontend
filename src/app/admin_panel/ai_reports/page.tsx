"use client";
import Pagination from "@/components/AdminPanel/Pagination";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useSearchParams, useRouter } from "next/navigation";
import { PrimaryBtn } from "@/components/Dashboard";
import Button from "@/components/AdminPanel/Buttons";
import UserEditor from "@/components/AdminPanel/UserEditor";
import { User } from "@/lib/User";
import { AIReport } from "@/lib/AIReport";
import AIReportViewer from "@/components/AdminPanel/AIReportViewer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Reports() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page") ?? "1";
    const [maxPages, setMaxPages] = useState<number>(1);
    const [reports, setReports] = useState<AIReport[]>([]);
    const [searchReviewed, setSerachReviewed] = useState<string>("all");
    const { setLoading, notify } = useUI();
    const [showReportViewer, setShowReportViewer] = useState<number | null>(
        null,
    );
    const [showUserEditor, setShowUserEditor] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    async function fetchReports(page: number = 1) {
        try {
            setLoading(true);
            const searchData: { is_reviewed?: boolean } = {};
            if (searchReviewed !== "all")
                searchData["is_reviewed"] = searchReviewed === "true";
            const res = await fetch(`${API_URL}/aireports?page=${page}`, {
                method: "POST",
                body: JSON.stringify(searchData),
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setReports(
                data.reports.map((item: AIReport) => ({
                    ...item,
                    timestamp: new Date(item.timestamp),
                })),
            );
            setMaxPages(data.max_pages);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    async function updateReport(update: {
        report_id: number;
        is_reviewed: boolean;
    }) {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/aireports`, {
                method: "PATCH",
                body: JSON.stringify(update),
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setReports((prev) =>
                prev.map((report) => {
                    if (report.id === update.report_id)
                        return { ...report, is_reviewed: update.is_reviewed };
                    return report;
                }),
            );
            notify(data.message, "success");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    async function OpenUser(user_id: number) {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/users`, {
                body: JSON.stringify({ id: user_id }),
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setUsers(data.users);
            // There can only be 1 user so open editor of nidex 0 user
            setShowUserEditor(0);
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
                    <AIReportViewer
                        report={reports[showReportViewer]}
                        CloseAction={() => {
                            setShowReportViewer(null);
                        }}
                        updateReportAction={updateReport}
                        OpenUserAction={OpenUser}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showUserEditor !== null ? (
                    <UserEditor
                        user={users[showUserEditor]}
                        setShowUserEditor={setShowUserEditor}
                        setUser={(updated_user: User) => {
                            const updatedUsers = users.map((user) => {
                                return user.id === updated_user.id
                                    ? updated_user
                                    : user;
                            });
                            setUsers(updatedUsers);
                        }}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            <h4>Reports by AI</h4>
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
                {reports.map((r, idx) => (
                    <div
                        key={r.id}
                        className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between items-start lg:flex-row flex-col lg:gap-0 gap-5"
                    >
                        <div>
                            <div className="text-sm text-white">
                                Report #{r.id}
                            </div>
                            <div className="text-xs text-gray-400">
                                Target User: {r.msg_sender_user.id}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                {new Date(r.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 lg:w-fit w-full">
                            <Button
                                label="View"
                                variant="neutral"
                                className="w-full"
                                onClick={() => {
                                    setShowReportViewer(idx);
                                }}
                            />
                            <div
                                className={`px-2 py-1 text-center rounded text-sm ${r.is_reviewed ? "bg-green-800" : "bg-red-800"}`}
                            >
                                {r.is_reviewed ? "Reviewed" : "Not Reviewed"}
                            </div>
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
