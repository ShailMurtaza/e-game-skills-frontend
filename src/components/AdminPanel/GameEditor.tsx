"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Game, GameAttr } from "@/lib/Game";
import { GameAttributes } from "./GameAttributes";
import Button from "./Buttons";
import { useUI } from "@/context/UIContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function GameEditor({
    game,
    setShowGameEditorAction,
    setGameAction,
}: {
    game: Game;
    setShowGameEditorAction: (data: number | null) => void;
    setGameAction: (data: Game) => void;
}) {
    const { setLoading, notify } = useUI();
    const [form, setForm] = useState<Game>({ ...game });
    const [gameName, setGameName] = useState<string>("");
    useEffect(() => setForm({ ...game }), [game]);
    // Set attributes for editing and set all to update
    const [attributes, setAttributes] = useState<GameAttr[]>([]);
    useEffect(() => {
        setAttributes(
            form.attributes.map((attr) => ({ ...attr, action: "update" })),
        );
        setGameName(form.name);
    }, [form]);

    async function saveGame() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/games`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({
                    ...form,
                    name: gameName,
                    attributes: attributes,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            notify(data.message, "success");
            setGameAction(data.game);
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center w-full h-full z-30 bg-black/80">
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-11/12 max-w-4xl p-4 bg-gray-900 rounded border border-gray-800 overflow-y-auto max-h-screen"
                >
                    <div className="flex flex-col gap-3">
                        <label className="text-xs text-gray-400">
                            Title
                            <input
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                                placeholder="Title of game"
                                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
                            />
                        </label>
                        <GameAttributes
                            label="Attributes"
                            gameId={form.id}
                            placeholder="Enter name of attribute e.g., Rank, Rold etc"
                            parentAttributes={attributes}
                            parentSetAttributes={setAttributes}
                        />
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button
                            label="Save"
                            variant="primary"
                            onClick={saveGame}
                        />
                        <Button
                            label="Close"
                            variant="neutral"
                            onClick={() => {
                                setShowGameEditorAction(null);
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </>
    );
}
