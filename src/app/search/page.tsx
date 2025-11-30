"use client";

import React, { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { FiSearch } from "react-icons/fi";
import { SearchResult } from "@/lib/SearchResults";
import Link from "next/link";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [attributeFilters, setAttributeFilters] = useState<
        Record<string, string>
    >({});
    const [searchResults, setSearchResults] = useState<SearchResult>([]);
    const [searched, setSearched] = useState<boolean>(false);
    const [searchedUserGames, setSearchedUserGames] = useState<
        { id: number; user_games: { game: { name: string } }[] }[]
    >([]);

    const [games, setGames] = useState<Game[]>([]);

    async function handleSearch() {
        if (!selectedGame) {
            notify("Select Game from filters", "error");
            return;
        }
        setLoading(true);
        const searchData = {
            name: searchName,
            game_id: selectedGame.id,
            attributes: attributeFilters,
        };
        try {
            const res = await fetch(`${API_URL}/users-games/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(searchData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            notify(data.message, "success");
            setSearchResults(data.results);
            setSearchedUserGames(data.games);
            setSearched(true);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }

    const handleAttributeChange = (attr_id: number, value: string) => {
        setAttributeFilters((prev) => {
            if (value === "") {
                const { [attr_id]: _removed, ...rest } = prev;
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
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred";
                notify(message, "error");
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
                                                setSearchResults([]);
                                                setSearched(false);
                                                setSelectedGame(game);
                                                setAttributeFilters({});
                                            }}
                                            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                                                selectedGame?.id === game.id
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
                            {selectedGame && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                                        Filter by {selectedGame?.name} Stats
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {selectedGame.attributes.map((attr) => (
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

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4">
                            {searchResults.length > 0
                                ? `Found ${searchResults.length} Players`
                                : "Search for players above"}
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {searchResults.map((player) => (
                                <Link
                                    href={`/portfolio/${player.id}`}
                                    target="_blank"
                                    key={player.id}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-950/60 cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar Placeholder */}
                                        <Image
                                            width={100}
                                            height={0}
                                            alt="Avatar"
                                            className="w-16 h-16  rounded-full border border-zinc-700 transition-all"
                                            src={
                                                player?.avatar
                                                    ? `${API_URL}/users/avatar/${player.avatar}`
                                                    : "/profile.png"
                                            }
                                        />

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate group-hover:text-zinc-200 transition-colors">
                                                {player.username}
                                            </h3>

                                            {/* Games Badges */}
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {searchedUserGames
                                                    .find(
                                                        (game) =>
                                                            game.id ===
                                                            player.id,
                                                    )
                                                    ?.user_games.map(
                                                        (
                                                            game: {
                                                                game: {
                                                                    name: string;
                                                                };
                                                            },
                                                            idx: number,
                                                        ) => {
                                                            return (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-2 py-1 bg-zinc-800/70 border border-zinc-700 rounded-full text-zinc-400 group-hover:bg-zinc-800 group-hover:border-zinc-600 transition-all"
                                                                >
                                                                    {
                                                                        game
                                                                            .game
                                                                            .name
                                                                    }
                                                                </span>
                                                            );
                                                        },
                                                    )}
                                            </div>

                                            {/* Game-specific stats */}
                                            {selectedGame &&
                                                player.user_games[0]
                                                    .attribute_values.length >
                                                    0 &&
                                                player.user_games[0].attribute_values.map(
                                                    (attr) => {
                                                        const attr_id =
                                                            attr.game_attribute_id;
                                                        const value =
                                                            attr.value;
                                                        const attr_name =
                                                            selectedGame.attributes.find(
                                                                (game_attr) =>
                                                                    attr_id ===
                                                                    game_attr.id,
                                                            )!.name;
                                                        return (
                                                            <div
                                                                className="mt-3 space-y-1"
                                                                key={attr_id}
                                                            >
                                                                <div className="flex justify-between text-xs">
                                                                    <span className="text-zinc-500 capitalize">
                                                                        {
                                                                            attr_name
                                                                        }
                                                                        :
                                                                    </span>
                                                                    <span className="text-zinc-300 font-medium">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {searched && searchResults.length === 0 && (
                            <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-2 bg-zinc-900/30 border border-dashed border-zinc-700 rounded-xl p-8 max-w-md mx-auto">
                                    <FiSearch size={15} />
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
