"use client";

import { useEffect, useState } from "react";
import React from "react";
import { RiLink, RiTrophyLine, RiCloseLargeFill } from "react-icons/ri";
import { useUI } from "@/context/UIContext";

interface Game {
    id: string;
    name: string;
    importantInfo: { label: string; value: string }[];
    additionalInfo: { label: string; value: string }[];
    links: { label: string; url: string }[];
    wins: { date: string; count: number }[];
    losses: { date: string; count: number }[];
}

const mockGames: Game[] = [
    {
        id: "valorant",
        name: "Valorant",
        importantInfo: [
            { label: "Rank", value: "Immortal 3" },
            { label: "Peak Rank", value: "Radiant" },
            { label: "Main Agent", value: "Jett" },
        ],
        additionalInfo: [
            { label: "Headshot %", value: "28.5%" },
            { label: "K/D Ratio", value: "1.45" },
            { label: "Playstyle", value: "Aggressive Entry" },
        ],
        links: [
            {
                label: "Tracker.gg",
                url: "https://tracker.gg/valorant/profile/...",
            },
            { label: "VODs", url: "https://youtube.com/@player" },
        ],
        wins: [
            { date: "2025-11-01", count: 5 },
            { date: "2025-11-02", count: 3 },
            { date: "2025-11-03", count: 7 },
        ],
        losses: [
            { date: "2025-11-01", count: 2 },
            { date: "2025-11-02", count: 4 },
            { date: "2025-11-03", count: 1 },
        ],
    },
    {
        id: "cs2",
        name: "CS2",
        importantInfo: [
            { label: "Rank", value: "Global Elite" },
            { label: "Faceit Level", value: "10" },
            { label: "Main Weapon", value: "AWP" },
        ],
        additionalInfo: [
            { label: "HS %", value: "62%" },
            { label: "ADR", value: "89.2" },
            { label: "Clutch Win %", value: "71%" },
        ],
        links: [
            { label: "Faceit", url: "https://faceit.com/players/..." },
            { label: "HLTV", url: "https://hltv.org/player/..." },
        ],
        wins: [
            { date: "2025-10-30", count: 4 },
            { date: "2025-10-31", count: 6 },
            { date: "2025-11-01", count: 5 },
        ],
        losses: [
            { date: "2025-10-30", count: 3 },
            { date: "2025-10-31", count: 2 },
            { date: "2025-11-01", count: 3 },
        ],
    },
    {
        id: "dota",
        name: "Dota 2",
        importantInfo: [
            { label: "Rank", value: "Herald 4" },
            { label: "K/D", value: "1.3" },
        ],
        additionalInfo: [
            { label: "Damage/Season", value: "1.2M" },
            { label: "Win Rate", value: "18.3%" },
        ],
        links: [
            { label: "Tracker", url: "https://tracker.gg/..." },
            { label: "Twitch", url: "https://twitch.tv/player" },
        ],
        wins: [
            { date: "2025-11-02", count: 2 },
            { date: "2025-11-03", count: 4 },
            { date: "2025-11-04", count: 1 },
        ],
        losses: [
            { date: "2025-11-02", count: 8 },
            { date: "2025-11-03", count: 5 },
            { date: "2025-11-04", count: 9 },
        ],
    },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Portfolio({
    params,
}: {
    params: Promise<{ user_id: string }>;
}) {
    const { user_id } = React.use(params);
    const { setLoading, notify } = useUI();
    const [user, setUser] = useState<{
        username: string;
        email: string;
        region: string;
        avatar: string;
        description: string;
    } | null>(null);
    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/users/profile/${user_id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                setUser(data);
            } catch (e: any) {
                notify(e.message, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);
    const [activeGame, setActiveGame] = useState<string>(mockGames[0].id);

    const currentGame = mockGames.find((g) => g.id === activeGame)!;

    return (
        <main className="pt-[200px] min-h-screen bg-black text-gray-100">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Section 1: User Data */}
                <section className="bg-zinc-950 rounded-2xl p-8 border border-zinc-800 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Profile Picture Placeholder */}
                        <img
                            className="bg-linear-to-br from-purple-600 to-blue-600 w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl"
                            src={
                                user?.avatar
                                    ? `${API_URL}/users/avatar/${user?.avatar}`
                                    : "/profile.png"
                            }
                        />

                        <div className="flex-1 text-center md:text-left space-y-3">
                            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {user?.username}
                            </h1>
                            <p className="text-gray-400 max-w-2xl">
                                {user?.description}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{user?.region}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: User Games */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Games I Play
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {mockGames.map((game) => (
                            <button
                                key={game.id}
                                onClick={() => setActiveGame(game.id)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg border ${
                                    activeGame === game.id
                                        ? "bg-linear-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-purple-500/30"
                                        : "bg-zinc-900 text-gray-300 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 hover:shadow-xl"
                                }`}
                            >
                                {game.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 3: Game Data */}
                <section className="bg-zinc-950 rounded-2xl p-8 border border-zinc-800 shadow-xl space-y-8">
                    <h2 className="text-3xl font-bold text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {currentGame.name} Stats
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Core Stats */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                    <RiTrophyLine className="w-5 h-5" />
                                    Core Information
                                </h3>
                                <div className="bg-zinc-900 rounded-xl p-5 space-y-3 border border-zinc-800">
                                    {currentGame.importantInfo.map(
                                        (info, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
                                            >
                                                <span className="text-gray-400">
                                                    {info.label}
                                                </span>
                                                <span className="font-medium text-white">
                                                    {info.value}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 mb-3">
                                    Additional Information
                                </h3>
                                <div className="bg-zinc-900 rounded-xl p-5 space-y-3 border border-zinc-800">
                                    {currentGame.additionalInfo.map(
                                        (info, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
                                            >
                                                <span className="text-gray-400">
                                                    {info.label}
                                                </span>
                                                <span className="font-medium text-white">
                                                    {info.value}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Links & Records */}
                        <div className="space-y-6">
                            {/* Links */}
                            <div>
                                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <RiLink className="w-5 h-5" />
                                    External Profiles
                                </h3>
                                <div className="bg-zinc-900 rounded-xl p-5 space-y-3 border border-zinc-800">
                                    {currentGame.links.map((link, idx) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0 group"
                                        >
                                            <span className="text-gray-400 group-hover:text-white transition-colors">
                                                {link.label}
                                            </span>
                                            <svg
                                                className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Wins & Losses */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Wins */}
                                <div>
                                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2 justify-center">
                                        <RiTrophyLine className="w-5 h-5" />
                                        Wins
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 space-y-2 border border-zinc-800 min-h-[140px]">
                                        {currentGame.wins.map((win, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-gray-500">
                                                    {win.date}
                                                </span>
                                                <span className="font-medium text-green-400">
                                                    +{win.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Losses */}
                                <div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2 justify-center">
                                        <RiCloseLargeFill className="w-5 h-5" />
                                        Losses
                                    </h3>
                                    <div className="bg-zinc-900 rounded-xl p-4 space-y-2 border border-zinc-800 min-h-[140px]">
                                        {currentGame.losses.map((loss, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-gray-500">
                                                    {loss.date}
                                                </span>
                                                <span className="font-medium text-red-400">
                                                    -{loss.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
