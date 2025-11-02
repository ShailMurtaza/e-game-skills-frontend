"use client";
import { PrimaryBtn, Input, Attributes } from "@/components/Dashboard";
import { AttributesType } from "@/lib/Attributes";
import { useAuth } from "@/context/authContext";
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
import { useEffect, useState } from "react";
import { LoadingComponent } from "@/components/Loading";
import AvatarUploader from "@/components/AvatarUploader";

export default function UserDashboard() {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>();
    const [userDescription, setUserDescription] = useState<string>();
    const { setLoading } = useUI();
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
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
    const { isLoading, isAuthenticated, userProfile } = useAuth();
    useEffect(() => {
        setUsername(userProfile?.username ?? "");
        setUserDescription(userProfile?.description ?? "");
    }, [userProfile]);
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
                <section className="flex flex-col gap-5 p-5 border-b border-white rounded-t-2xl">
                    <div className="flex flex-row items-center gap-10">
                        <AvatarUploader onFileSelect={setAvatarFile} />
                        <div className="flex flex-col">
                            <div className="mb-2 font-bold">Enter Username</div>
                            <Input
                                name="username"
                                placeholder="Username"
                                type="text"
                                value={username}
                                className="w-fit"
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 font-bold">Edit Description</div>
                        <textarea
                            className="w-full text-white p-4 border border-white rounded-xl outline-none"
                            defaultValue={userDescription}
                            rows={4}
                            onChange={(e) => {
                                setUserDescription(e.target.value);
                            }}
                        />
                    </div>
                    <PrimaryBtn text="Save" className="w-fit" />
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
