"use client";
import { motion } from "framer-motion";
import { Report } from "@/lib/Report";
import Button from "./Buttons";

export default function ReportViewer({
    report,
    updateReportAction,
    OpenUserAction,
    CloseAction,
}: {
    report: Report;
    updateReportAction: (data: {
        report_id: number;
        is_reviewed: boolean;
    }) => void;
    OpenUserAction: (data: number) => void;
    CloseAction: () => void;
}) {
    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center w-full h-full z-30 bg-black/80">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-5 w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-1">
                            <h5 className="text-gray-400">Reporter</h5>
                            <p
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none hover:bg-gray-600 cursor-pointer"
                                onClick={() => {
                                    OpenUserAction(report.reporter_id);
                                }}
                            >
                                <b>User ID:</b> {report.reporter_id}
                            </p>
                        </div>
                        <div className="md:col-span-1">
                            <h5 className="text-gray-400">Target</h5>
                            <p
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none hover:bg-gray-600 cursor-pointer"
                                onClick={() => {
                                    OpenUserAction(report.target_id);
                                }}
                            >
                                <b>User ID:</b> {report.target_id}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <h5 className="text-gray-400">Reason</h5>
                            <p className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none">
                                {report.reason}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <h5 className="text-gray-400">Description</h5>
                            <pre className="w-full mt-1 bg-gray-800 px-2 py-2 rounded outline-none">
                                {report.description}
                            </pre>
                        </div>
                    </div>

                    <div className="flex flex-row gap-5">
                        <Button
                            label="Open Conversation"
                            variant="secondary"
                            onClick={() => {
                                window.open(
                                    `/conversation?sender_id=${report.reporter_id}&receiver_id=${report.target_id}`,
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                            }}
                        />
                        <Button
                            label={
                                report.is_reviewed
                                    ? "Set as Not Reviewed"
                                    : "Set as Reviewed"
                            }
                            variant={report.is_reviewed ? "danger" : "primary"}
                            onClick={() => {
                                updateReportAction({
                                    report_id: report.id,
                                    is_reviewed: !report.is_reviewed,
                                });
                            }}
                        />
                        <Button
                            label="close"
                            onClick={() => {
                                CloseAction();
                            }}
                            variant="neutral"
                        />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
