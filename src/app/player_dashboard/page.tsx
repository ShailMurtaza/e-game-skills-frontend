"use client";
import { PrimaryBtn, Attributes } from "@/components/Dashboard";
import { AttributesType } from "@/lib/Attributes";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";

import { useEffect, useState } from "react";
import { LoadingComponent } from "@/components/Loading";
import UpdateUserProfile from "@/components/UpdateUserProfile";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserDashboard() {
    const { setLoading } = useUI();
    const [games, setGames] = useState<any[]>([]);
    const [userGames, setUserGames] = useState<any[]>([]);
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
        // Fetch Games
        fetch(`${API_URL}/games`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => setGames(data));
        // Fetch Games
        fetch(`${API_URL}/users-games`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setUserGames(data));
    }, []);
    const [Information, setInformation] = useState<AttributesType>([
        { Rank: "gold" },
    ]);
    const [Links, setLinks] = useState<AttributesType>([
        {
            Tracker:
                "https://tracker.gg/valorant/profile/riot/ShailXHunter%230000",
        },
        { Facebook: "https://facebook.com/user/01234" },
    ]);
    const [Wins, setWins] = useState<AttributesType>([]);
    const [Loss, setLoss] = useState<AttributesType>([]);

    const { isLoading, isAuthenticated, userProfile } = useAuth();

    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "player"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px] mx-10">
            <div className="border border-white rounded-2xl bg-neutral-950">
                <UpdateUserProfile />
                <section className="flex flex-row">
                    <div className="w-1/4 p-5 border-r border-white">
                        <h4 className="mb-5">Your Games</h4>
                        <div className="flex flex-col gap-5">
                            {userGames.map((g) => {
                                const game_id = g.game_id;
                                const game = games.find(
                                    (game) => game_id == game.id,
                                );
                                return (
                                    <PrimaryBtn
                                        key={game_id}
                                        text={game.name}
                                    />
                                );
                            })}
                            <PrimaryBtn text="+" />
                        </div>
                    </div>
                    <div className="w-3/4 p-5">
                        <h3 className="mb-5">Dota 2</h3>
                        <Attributes
                            title="Information"
                            key_placeholder="Enter name of attribute e.g., Rank, Rold etc"
                            value_placeholder="Enter value of attribute e.g., Iron 3, Bronze 1 etc"
                            parentAttributes={Information}
                            parentSetAttributes={setInformation}
                        />
                        <Attributes
                            title="Links"
                            key_placeholder="Enter name of link e.g., Tracker, Facebook etc"
                            value_placeholder="Enter link e.g., https://tracker.gg/user/123"
                            parentAttributes={Links}
                            parentSetAttributes={setLinks}
                        />
                        <Attributes
                            title="Wins"
                            key_input_type="date"
                            key_placeholder="Enter date"
                            value_placeholder="Enter value"
                            parentAttributes={Wins}
                            parentSetAttributes={setWins}
                        />
                        <Attributes
                            title="Loss"
                            key_input_type="date"
                            key_placeholder="Enter date"
                            value_placeholder="Enter value"
                            parentAttributes={Loss}
                            parentSetAttributes={setLoss}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}
