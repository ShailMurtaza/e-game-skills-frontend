"use client";

import React, { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { FiSearch, FiUser } from "react-icons/fi";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const mockPlayers = [
    {
        id: 1,
        name: "ShadowX",
        avatar: "",
        games: ["Valorant", "CS2"],
        stats: {
            valorant: { rank: "Immortal 3", kd: "1.45", headshot: "28%" },
            cs2: { rank: "Global Elite", kd: "1.32", playtime: "1240h" },
        },
    },
    {
        id: 2,
        name: "NinjaPro",
        avatar: "",
        games: ["Apex Legends"],
        stats: {
            apex: { rank: "Master", kd: "2.1", damage: "1240" },
        },
    },
    {
        id: 3,
        name: "Phantom",
        avatar: "",
        games: ["Valorant", "Apex Legends", "CS2"],
        stats: {
            valorant: { rank: "Radiant", kd: "1.8", headshot: "32%" },
            apex: { rank: "Predator", kd: "2.4", damage: "1800" },
            cs2: { rank: "Global Elite", kd: "1.55", playtime: "2100h" },
        },
    },
];

type Attribute = {
    id: number;
    name: string;
    game_id: number; // Not needed in this page though
};

type Game = {
    id: number;
    name: string;
    attributes: Attribute[];
};

export default function SearchPage() {
    const { setLoading, notify } = useUI();
    const [searchName, setSearchName] = useState("");
    const [selectedGame, setSelectedGame] = useState<number | null>(null);
    const [attributeFilters, setAttributeFilters] = useState<
        Record<string, string>
    >({});
    const [searchResults, setSearchResults] = useState<typeof mockPlayers>([]);

    const [games, setGames] = useState<Game[]>([]);
    const currentGame: Game | null =
        games.find((g) => g.id === selectedGame) || null;

    const handleSearch = () => {
        setSearchResults(mockPlayers);
    };

    const handleAttributeChange = (attr_id: number, value: string) => {
        setAttributeFilters((prev) => {
            if (value === "") {
                const { [attr_id]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [attr_id]: value,
            };
        });
    };

    useEffect(() => {
        async function fetchGames() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/games`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "ERROR");
                setGames(data);
            } catch (e: any) {
                notify(e.message, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchGames();
    }, []);

    return (
        <>
            <div className="pt-[150px] min-h-screen bg-black text-white">
                <div className="max-w-6xl mx-auto p-6">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <div className="flex gap-3 max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                            <button
                                onClick={handleSearch}
                                className="flex flex-row items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/50 active:scale-95"
                            >
                                <FiSearch />
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-10 bg-zinc-950/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
                        <div className="space-y-6">
                            {/* Game Selector */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-3">
                                    Select Game
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {games.map((game) => (
                                        <button
                                            key={game.id}
                                            onClick={() => {
                                                setSelectedGame(game.id);
                                                setAttributeFilters({});
                                            }}
                                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                                selectedGame === game.id
                                                    ? "bg-emerald-900 border-emerald-600 text-white shadow-md"
                                                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white hover:bg-zinc-800"
                                            }`}
                                        >
                                            {game.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Attribute Filters */}
                            {currentGame && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                                        Filter by {currentGame?.name} Stats
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {currentGame.attributes.map((attr) => (
                                            <div key={attr.id}>
                                                <label className="block text-xs text-zinc-500 mb-1">
                                                    {attr.name}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={`Enter ${attr.name.toLowerCase()}...`}
                                                    value={
                                                        attributeFilters[
                                                            attr.id
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleAttributeChange(
                                                            attr.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4">
                            {searchResults.length > 0
                                ? `Found ${searchResults.length} Players`
                                : "Search for players above"}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {searchResults.map((player: any) => (
                                <div
                                    key={player.id}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-950/60 cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar Placeholder */}
                                        <div className="w-16 h-16 bg-linear-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-zinc-600 transition-all">
                                            <div className="w-8 h-8 bg-zinc-600 rounded-full" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate group-hover:text-zinc-200 transition-colors">
                                                {player.name}
                                            </h3>

                                            {/* Games Badges */}
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {player.games.map(
                                                    (game: any) => (
                                                        <span
                                                            key={game}
                                                            className="text-xs px-2 py-1 bg-zinc-800/70 border border-zinc-700 rounded-full text-zinc-400 group-hover:bg-zinc-800 group-hover:border-zinc-600 transition-all"
                                                        >
                                                            {game}
                                                        </span>
                                                    ),
                                                )}
                                            </div>

                                            {/* Game-specific stats */}
                                            {selectedGame &&
                                                player.stats[selectedGame] && (
                                                    <div className="mt-3 space-y-1">
                                                        {Object.entries(
                                                            player.stats[
                                                                selectedGame
                                                            ],
                                                        ).map(
                                                            ([key, value]) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex justify-between text-xs"
                                                                >
                                                                    <span className="text-zinc-500 capitalize">
                                                                        {key
                                                                            .replace(
                                                                                /([A-Z])/g,
                                                                                " $1",
                                                                            )
                                                                            .trim()}
                                                                        :
                                                                    </span>
                                                                    <span className="text-zinc-300 font-medium">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {searchResults.length === 0 && searchName && (
                            <div className="text-center py-12">
                                <div className="bg-zinc-900/30 border border-dashed border-zinc-700 rounded-xl p-8 max-w-md mx-auto">
                                    <FiSearch />
                                    <div className="text-zinc-600 mb-3">
                                        No players found
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        Try adjusting your search or filters
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
