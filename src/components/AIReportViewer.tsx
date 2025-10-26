"use client";
import Overlay from "./Overlay";
import { motion } from "framer-motion";
import { AIReport } from "@/lib/AIReport";

export default function AIReportViewer({
    report,
    CloseAction,
}: {
    report: AIReport;
    CloseAction: () => void;
}) {
    return (
        <>
            <Overlay display="" />
            <div className="fixed inset-0 flex justify-center items-center w-full h-full z-30">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-1">
                            <h5 className="text-gray-400">Severity</h5>
                            <p className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none">
                                {report.severity}
                            </p>
                        </div>
                        <div className="md:col-span-1">
                            <h5 className="text-gray-400">Target</h5>
                            <p className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none">
                                <b>User ID:</b> {report.targetId}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <h5 className="text-gray-400">Note</h5>
                            <p className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none">
                                {report.note}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            CloseAction();
                        }}
                        className="mt-3 px-3 py-2 rounded bg-gray-800 text-sm"
                    >
                        Close
                    </button>
                </motion.div>
            </div>
        </>
    );
}
