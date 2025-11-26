"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Game } from "@/lib/Game";
import GameEditor from "@/components/AdminPanel/GameEditor";
import Button from "@/components/AdminPanel/Buttons";
import { useUI } from "@/context/UIContext";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Games() {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [showGameEditor, setShowGameEditor] = useState<number | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [gameDelete, setGameDelete] = useState<number | null>(null);
    const { setLoading, notify } = useUI();

    useEffect(() => {
        async function fetchGames() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/games`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                setGames(data);
            } catch (e: unknown) {
                const message =
                    e instanceof Error
                        ? e.message
                        : "An unexpected error occurred";
                notify(message, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchGames();
    }, []);
    async function deleteGame(game_id: number) {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/games/${game_id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            setGames(games.filter((game) => game.id !== game_id));
            notify("Game Deleted", "success");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setGameDelete(null);
            setLoading(false);
        }
    }
    function setGame(game: Game) {
        let found = false;
        let newGames = games.map((g) => {
            if (g.id === game.id) {
                found = true;
                return game;
            }
            return g;
        });
        if (!found) {
            newGames = games;
            // Set game using index of last created new game which doesn't have any id
            newGames[games.length - 1] = game;
        }
        setGames(newGames);
    }
    return (
        <main>
            {/* User Details Editor */}
            <AnimatePresence mode="wait">
                {showGameEditor !== null ? (
                    <GameEditor
                        key={showGameEditor}
                        game={games[showGameEditor]}
                        setShowGameEditor={setShowGameEditor}
                        setGame={setGame}
                    />
                ) : (
                    ""
                )}
            </AnimatePresence>
            {gameDelete && (
                <DeleteConfirmDialog
                    onCancel={() => {
                        setGameDelete(null);
                    }}
                    onDelete={() => {
                        deleteGame(gameDelete);
                    }}
                />
            )}
            <h4>Games</h4>
            <div className="mt-5 space-y-3">
                <Button
                    label="New Game"
                    variant="primary"
                    onClick={() => {
                        const newGame = { name: "", attributes: [] };
                        setGames((prevGames) => {
                            const newGames = [...prevGames, newGame];
                            setShowGameEditor(newGames.length - 1);
                            return newGames;
                        });
                    }}
                />
                {games.map((game, game_idx) => {
                    if (game?.id)
                        return (
                            <div key={game.id}>
                                <div className="p-3 bg-gray-850 rounded border border-gray-800 flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-white">
                                            {game.name}
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
                                                        : game.id!,
                                                )
                                            }
                                        />
                                        <Button
                                            label="Edit"
                                            variant="secondary"
                                            onClick={() => {
                                                setShowGameEditor(game_idx);
                                            }}
                                        />
                                        <button
                                            className="px-2 py-1 rounded bg-red-700 text-sm"
                                            onClick={() => {
                                                setGameDelete(game.id!);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {openDropdown === game.id && (
                                    <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-700 space-y-1">
                                        {game.attributes.map((attr, idx) => {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="text-xs text-gray-30"
                                                >
                                                    {attr.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                })}
            </div>
        </main>
    );
}
