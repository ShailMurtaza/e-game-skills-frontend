"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Game } from "@/lib/Game";
import GameEditor from "@/components/GameEditor";
import Button from "@/components/AdminPanel/Buttons";

// Games mock
const games: Game[] = [
    {
        id: 1,
        title: "Dota 2",
        attributes: [
            { Rank: "text" },
            { Hours: "number" },
            { WinRate: "number" },
        ],
    },
    {
        id: 2,
        title: "League of Legends",
        attributes: [
            { Rank: "text" },
            { Hours: "number" },
            { WinRate: "number" },
            { KDA: "number" },
        ],
    },
    {
        id: 3,
        title: "Counter-Strike",
        attributes: [
            { Rank: "text" },
            { Hours: "number" },
            { WinRate: "number" },
        ],
    },
];
export default function Games() {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [showGameEditor, setShowGameEditor] = useState<Game | null>(null);
    return (
        <main>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showGameEditor !== null ? (
                    <GameEditor
                        game={showGameEditor}
                        setShowGameEditor={setShowGameEditor}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            <h4>Games</h4>
            <div className="mt-5 space-y-3">
                {games.map((game) => (
                    <div key={game.id}>
                        <div className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-white">
                                    {game.title}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    label="Attributes"
                                    variant="neutral"
                                    onClick={() =>
                                        setOpenDropdown(
                                            openDropdown === game.id
                                                ? null
                                                : game.id,
                                        )
                                    }
                                />
                                <Button
                                    label="Edit"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowGameEditor(game);
                                    }}
                                />
                                <button className="px-2 py-1 rounded bg-red-700 text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                        {openDropdown === game.id && (
                            <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-700 space-y-1">
                                {game.attributes.map((attr, idx) => {
                                    const key = Object.keys(attr)[0];
                                    const value = Object.keys(attr)[0];
                                    return (
                                        <div
                                            key={idx}
                                            className="text-xs text-gray-30"
                                        >
                                            {key}: {value}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
