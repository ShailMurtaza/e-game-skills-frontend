"use client";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { motion } from "framer-motion";
import { Game, GameAttr } from "@/lib/Game";
import { GameAttributes } from "./AdminPanel/GameAttributes";
import Button from "./AdminPanel/Buttons";

export default function GameEditor({
    game,
    setShowGameEditor,
}: {
    game: Game;
    setShowGameEditor: (data: Game | null) => void;
}) {
    const [form, setForm] = useState<Game>({ ...game });
    useEffect(() => setForm({ ...game }), [game]);

    const [attributes, setAttributes] = useState<GameAttr[]>(form.attributes);

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
                    <div className="flex flex-col gap-3">
                        <label className="text-xs text-gray-400">
                            Title
                            <input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>
                        <GameAttributes
                            label="Attributes"
                            placeholder="Enter name of attribute e.g., Rank, Rold etc"
                            parentAttributes={attributes}
                            parentSetAttributes={setAttributes}
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            label="Save"
                            variant="primary"
                            onClick={() => {}}
                        />
                        <Button
                            label="Close"
                            variant="neutral"
                            onClick={() => {
                                setShowGameEditor(null);
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
