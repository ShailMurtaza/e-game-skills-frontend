"use client";

import { useEffect, useState } from "react";
import React from "react";
import { RiLink, RiTrophyLine, RiCloseLargeFill } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { useUI } from "@/context/UIContext";
import Chart from "@/components/Chart";

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
    const [userGames, setUserGames] = useState<any[]>([]);
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
        async function fetchUserGames() {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/users-games/allData/${user_id}`,
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                const transformed_user_games = data.map((user_game: any) => {
                    const { WinsLoss, ...rest } = user_game; // Remove WinsLoss
                    var wins: { date: string; value: number }[] = [];
                    var losses: { date: string; value: number }[] = [];
                    WinsLoss.map((data: any) => {
                        const date = new Date(data.date)
                            .toISOString()
                            .split("T")[0];
                        if (data.type === "Win")
                            wins.push({ date: date, value: data.value });
                        else if (data.type === "Loss")
                            losses.push({ date: date, value: data.value });
                    });
                    return {
                        ...rest,
                        wins: wins,
                        losses: losses,
                    };
                });
                setUserGames(transformed_user_games);
            } catch (e: any) {
                notify(e.message, "error");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
        fetchUserGames();
    }, []);
    const [activeGame, setActiveGame] = useState<number | null>(null);
    const currentGame = userGames.find((g) => g.game_id === activeGame)!;

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
                                <IoLocationSharp size={15} />
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
                        {userGames.map((user_game) => {
                            const game = user_game.game;
                            return (
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
                            );
                        })}
                    </div>
                </section>

                {/* Section 3: Game Data */}
                {currentGame && (
                    <section className="bg-zinc-950 rounded-2xl p-8 border border-zinc-800 shadow-xl space-y-8">
                        <h2 className="text-3xl font-bold text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {currentGame.game.name} Stats
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
                                        {currentGame.attribute_values.map(
                                            (info: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
                                                >
                                                    <span className="text-gray-400">
                                                        {
                                                            info.game_attribute
                                                                .name
                                                        }
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
                                        {currentGame.custom_attributes.map(
                                            (info: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
                                                >
                                                    <span className="text-gray-400">
                                                        {info.name}
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
                                        {currentGame.Links.map(
                                            (link: any, idx: number) => (
                                                <a
                                                    key={idx}
                                                    href={link.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0 group"
                                                >
                                                    <span className="text-gray-400 group-hover:text-white transition-colors">
                                                        {link.name}
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
                                            ),
                                        )}
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
                                            {currentGame.wins.map(
                                                (win: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <span className="text-gray-500">
                                                            {win.date}
                                                        </span>
                                                        <span className="font-medium text-green-400">
                                                            +{win.value}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Losses */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2 justify-center">
                                            <RiCloseLargeFill className="w-5 h-5" />
                                            Losses
                                        </h3>
                                        <div className="bg-zinc-900 rounded-xl p-4 space-y-2 border border-zinc-800 min-h-[140px]">
                                            {currentGame.losses.map(
                                                (loss: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <span className="text-gray-500">
                                                            {loss.date}
                                                        </span>
                                                        <span className="font-medium text-red-400">
                                                            -{loss.value}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Graphs */}
                        <div className="flex flex-col gap-10">
                            <div className="bg-zinc-900 rounded-xl p-4 space-y-2 border border-zinc-800">
                                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2 justify-center">
                                    <RiTrophyLine className="w-5 h-5" />
                                    Wins
                                </h3>
                                <Chart data={currentGame.wins} />
                            </div>
                            <div className="bg-zinc-900 rounded-xl p-4 space-y-2 border border-zinc-800">
                                <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2 justify-center">
                                    <RiCloseLargeFill className="w-5 h-5" />
                                    Losses
                                </h3>
                                <Chart data={currentGame.losses} />
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
