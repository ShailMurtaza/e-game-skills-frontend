"use client";

import { useEffect, useState } from "react";
import React from "react";
import { RiLink, RiTrophyLine, RiCloseLargeFill } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";
import { useUI } from "@/context/UIContext";
import Chart from "@/components/Chart";
import Link from "next/link";
import { PublicUser } from "@/lib/User";
import { WinsLossType, UserGameSearchFormated } from "@/lib/UserGames";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Portfolio({
    params,
}: {
    params: Promise<{ user_id: string }>;
}) {
    const { user_id } = React.use(params);
    const { setLoading, notify } = useUI();
    const [user, setUser] = useState<PublicUser | null>(null);
    const [userGames, setUserGames] = useState<UserGameSearchFormated[]>([]);
    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/users/profile/${user_id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                setUser(data);
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
        async function fetchUserGames() {
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/users-games/allData/${user_id}`,
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed");
                const transformed_user_games = data.map(
                    (user_game: { WinsLoss: WinsLossType[] }) => {
                        const { WinsLoss, ...rest } = user_game; // Remove WinsLoss
                        const wins: { date: string; value: number }[] = [];
                        const losses: { date: string; value: number }[] = [];
                        WinsLoss.map((data: WinsLossType) => {
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
                    },
                );

                setUserGames(transformed_user_games);
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
        fetchUser();
        fetchUserGames();
    }, []);
    const [activeGame, setActiveGame] = useState<number | null>(null);
    const currentGame = userGames.find((g) => g.game_id === activeGame)!;

    return (
        <main className="pt-[150px] min-h-screen bg-zinc-800 text-black font-mono">
            <div className="max-w-3xl mx-auto space-y-6 border-4 border-red-500 p-4 bg-yellow-200">
                {/* Section 1: User Data */}
                <section className="bg-green-400 p-4 border-4 border-blue-500">
                    <div className="flex flex-col items-center gap-2">
                        {/* Profile Picture */}
                        <Image
                            width={80}
                            height={80}
                            alt="Avatar"
                            className="bg-pink-500 w-20 h-20 border-2 border-black"
                            src={
                                user?.avatar
                                    ? `${API_URL}/users/avatar/${user?.avatar}`
                                    : "/profile.png"
                            }
                        />

                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-bold text-red-700 underline">
                                {user?.username}
                            </h1>
                            <Link
                                href={`mailto:${encodeURIComponent(user?.email || "")}`}
                                target="_blank"
                                className="block text-blue-800 underline"
                            >
                                {user?.email}
                            </Link>
                            <p className="text-black bg-white p-1 border-2 border-red-400">
                                {user?.description}
                            </p>
                            <div className="text-sm text-purple-900">
                                {user?.country} • {user?.region}
                            </div>
                            <div>
                                <Link
                                    href={`/messages?user=${user_id}`}
                                    className="block bg-orange-500 text-black font-bold p-2 mt-2 border-2 border-black"
                                >
                                    Contact Me
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: User Games */}
                {userGames.length != 0 && (
                    <section className="space-y-2 border-4 border-purple-700 bg-lime-300 p-3">
                        <h2 className="text-lg font-bold text-red-800">
                            Games I Play
                        </h2>
                        <div className="flex flex-wrap gap-1">
                            {userGames.map((user_game) => {
                                const game = user_game.game;
                                if (!game) return;
                                return (
                                    <button
                                        key={game.id}
                                        onClick={() => setActiveGame(game.id)}
                                        className={`px-2 py-1 border-2 ${
                                            activeGame === game.id
                                                ? "bg-blue-600 text-white border-black"
                                                : "bg-yellow-500 text-red-900 border-red-600"
                                        }`}
                                    >
                                        {game.name}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Section 3: Game Data */}
                {currentGame && (
                    <section className="bg-pink-200 p-4 border-4 border-black space-y-4">
                        <h2 className="text-xl font-bold text-center text-blue-900 underline">
                            {currentGame?.game?.name} Stats
                        </h2>

                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <h3 className="text-sm font-bold text-red-700">
                                    Core Info
                                </h3>
                                <div className="bg-white p-2 border-2 border-green-700">
                                    {currentGame?.attribute_values?.map(
                                        (info, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between py-1 border-b-2 border-black"
                                            >
                                                <span>
                                                    {info.game_attribute.name}
                                                </span>
                                                <span>{info.value}</span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-purple-700">
                                    Additional Info
                                </h3>
                                <div className="bg-white p-2 border-2 border-blue-700">
                                    {currentGame?.custom_attributes?.map(
                                        (info, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between py-1 border-b-2 border-black"
                                            >
                                                <span>{info.name}</span>
                                                <span>{info.value}</span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <h3 className="text-xs font-bold text-green-800">
                                        Wins
                                    </h3>
                                    <div className="bg-white p-1 border-2 border-black">
                                        {currentGame.wins.map(
                                            (win, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between text-xs"
                                                >
                                                    <span>{win.date}</span>
                                                    <span>+{win.value}</span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-bold text-red-800">
                                        Losses
                                    </h3>
                                    <div className="bg-white p-1 border-2 border-black">
                                        {currentGame.losses.map(
                                            (loss, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between text-xs"
                                                >
                                                    <span>{loss.date}</span>
                                                    <span>-{loss.value}</span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
