"use client";
import { PrimaryBtn, Input, Attributes } from "@/components/Dashboard";
import { AttributesType } from "@/lib/Attributes";
import { useUI } from "@/context/UIContext";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useState } from "react";
import useAuthRedirect from "@/utils/useAuthRedirect";
import { LoadingComponent } from "@/components/Loading";

export default function UserDashboard() {
    const { isLoading, isAuthenticated } = useAuthRedirect();
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

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    );
    const options = {};
    const lineChartData = {
        labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ],
        datasets: [
            {
                label: "Steps",
                data: [3000, 5000, 4500, 6000, 8000, 7000, 9000],
                borderColor: "rgb(75, 192, 192)",
            },
        ],
    };
    if (isLoading || (!isLoading && !isAuthenticated)) {
        return <LoadingComponent />;
    } else
        return (
            <main className="pt-[150px] mx-10">
                <div className="border border-white rounded-2xl bg-neutral-950">
                    <section className="flex flex-col gap-5 p-5 border-b border-white rounded-t-2xl">
                        <div className="flex flex-row items-center gap-10">
                            <img src="/profile.png" width="100px" />
                            <span>Username</span>
                        </div>
                        <div>
                            My name is Shail, a Dota 2 player from Pakistan,
                            with 2 years of experience in competitive and casual
                            matches. I specialize in carry and support roles,
                            focusing on high-level strategy, coordination, and
                            decision-making. I carry my team so good that they
                            end up cursing me at the end of every game.
                            Sometimes people wonder if I'm playing as carry with
                            support hero or as support with carry hero. I’m
                            passionate about improving as both a player and
                            teammate and am always open to scrims or new team
                            opportunities.
                        </div>
                        <PrimaryBtn text="Edit" />
                    </section>
                    <section className="flex flex-row">
                        <div className="w-1/4 p-5 border-r border-white">
                            <h4 className="mb-5">Your Games</h4>
                            <div className="flex flex-col gap-5">
                                <PrimaryBtn text="Dota 2" active={true} />
                                <PrimaryBtn text="Valorant" />
                                <PrimaryBtn text="Counter Strike" />
                                <PrimaryBtn text="PUBG" />
                                <PrimaryBtn text="FreeFire" />
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
                            <div>
                                <Line options={options} data={lineChartData} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        );
}
