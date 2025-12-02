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
            <div className="pt-[150px] min-h-screen bg-gray-950 text-purple-900">
                <div className="max-w-6xl mx-auto p-6">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="flex gap-2 max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className="flex-1 bg-yellow-100 border border-red-500 rounded-none px-3 py-2 text-black placeholder-gray-400"
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                            <button
                                onClick={handleSearch}
                                className="flex items-center gap-2 px-5 py-2 bg-orange-200 border border-blue-500 text-black"
                            >
                                <FiSearch />
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-8 bg-green-100 border border-pink-500 rounded-none p-4">
                        <div className="space-y-4">
                            {/* Game Selector */}
                            <div>
                                <label className="block text-sm text-red-700 mb-2">
                                    Select Game
                                </label>
                                <div className="flex flex-wrap gap-1">
                                    {games.map((game) => (
                                        <button
                                            key={game.id}
                                            onClick={() => {
                                                setSearchResults([]);
                                                setSearched(false);
                                                setSelectedGame(game);
                                                setAttributeFilters({});
                                            }}
                                            className={`px-3 py-1 border rounded-none ${
                                                selectedGame?.id === game.id
                                                    ? "bg-blue-200 border-green-500 text-black"
                                                    : "bg-purple-200 border-red-500 text-orange-700"
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
                                    <label className="block text-sm text-orange-700 mb-2">
                                        Filter by {selectedGame?.name} Stats
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {selectedGame.attributes.map((attr) => (
                                            <div key={attr.id}>
                                                <label className="block text-xs text-blue-800 mb-1">
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
                                                    className="w-full bg-pink-100 border border-yellow-500 rounded-none px-2 py-1 text-sm text-black placeholder-gray-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-blue-900 mb-2">
                            {searchResults.length > 0
                                ? `Found ${searchResults.length} Players`
                                : "Search for players above"}
                        </h2>

                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {searchResults.map((player) => (
                                <Link
                                    href={`/portfolio/${player.id}`}
                                    target="_blank"
                                    key={player.id}
                                    className="bg-purple-100 border border-pink-500 rounded-none p-4 cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <Image
                                            width={100}
                                            height={0}
                                            alt="Avatar"
                                            className="w-16 h-16 rounded-none border border-red-500"
                                            src={
                                                player?.avatar
                                                    ? `${API_URL}/users/avatar/${player.avatar}`
                                                    : "/profile.png"
                                            }
                                        />

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-black truncate">
                                                {player.username}
                                            </h3>

                                            {/* Games Badges */}
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {searchedUserGames
                                                    .find(
                                                        (game) =>
                                                            game.id ===
                                                            player.id,
                                                    )
                                                    ?.user_games.map(
                                                        (game, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs px-2 py-1 bg-orange-200 border border-purple-500 rounded-none text-blue-900"
                                                            >
                                                                {game.game.name}
                                                            </span>
                                                        ),
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
                                                                className="mt-2"
                                                                key={attr_id}
                                                            >
                                                                <div className="flex justify-between text-xs text-purple-800">
                                                                    <span className="capitalize">
                                                                        {
                                                                            attr_name
                                                                        }
                                                                        :
                                                                    </span>
                                                                    <span className="font-medium text-red-700">
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
                            <div className="text-center py-10">
                                <div className="flex flex-col items-center gap-2 bg-green-100 border border-red-500 rounded-none p-6 max-w-md mx-auto">
                                    <FiSearch size={15} />
                                    <div className="text-red-700 mb-2">
                                        No players found
                                    </div>
                                    <p className="text-xs text-purple-900">
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
