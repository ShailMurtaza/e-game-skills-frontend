import { ContactMessage } from "@/lib/ContactMessage";
import { motion } from "framer-motion";
import Button from "./Buttons";
import formatDate from "@/lib/FormatDate";
import Link from "next/link";
export default function ContactMessageViewer({
    contactMessage,
    CloseAction,
}: {
    contactMessage: ContactMessage;
    CloseAction: () => void;
}) {
    return (
        <div className="fixed inset-0 flex justify-center items-center w-full h-full z-30 bg-black/80">
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-5 w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800 overflow-y-auto max-h-screen"
            >
                <div className="w-full flex flex-row justify-between gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-xs text-gray-400 w-full">
                            Username
                        </label>
                        <div className="w-full bg-gray-800 px-2 py-2 rounded text-sm">
                            {contactMessage.name}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-xs text-gray-400 w-full">
                            Email
                        </label>
                        <div className="w-full bg-gray-800 px-2 py-2 rounded text-sm">
                            <Link
                                href={`mailto:${contactMessage.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {contactMessage.email}
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 w-full">Date</label>
                    <div className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm">
                        {formatDate(contactMessage.timestamp)}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 w-full">
                        Message
                    </label>
                    <pre className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none overflow-y-auto max-h-[calc(80vh-90px)]">
                        {contactMessage.message}
                    </pre>
                </div>
                <div>
                    <Button
                        label="Close"
                        variant="neutral"
                        onClick={CloseAction}
                    />
                </div>
            </motion.div>
        </div>
    );
}
