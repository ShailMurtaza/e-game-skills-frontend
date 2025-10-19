"use client";
import { useState } from "react";

function PrimaryBtn({ text }: { text: string }) {
    return (
        <button className="p-3 font-semibold rounded-md cursor-pointer bg-emerald-700 text-white shadow hover:bg-emerald-500 transition">
            {text}
        </button>
    );
}

function Input({
    name,
    type,
    value,
    placeholder,
    onChange,
}: {
    name: string;
    type: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="block w-full rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-white-500 focus:border-indigo-500 focus:outline-none p-3"
        />
    );
}

export default function UserDashboard() {
    const [attributes, setAttributes] = useState<{ [key: string]: string }[]>([
        { Rank: "Iron" },
        { Role: "Carry" },
    ]);
    const [links, setLinks] = useState<{ [key: string]: string }[]>([
        {
            Tracker:
                "https://tracker.gg/valorant/profile/riot/ShailXHunter%230000",
        },
        { Facebook: "https://facebook.com/user/01234" },
    ]);
    return (
        <main className="pt-[150px] mx-10">
            <div className="border-1 border-white rounded-2xl bg-neutral-950">
                <section className="flex flex-col gap-5 p-5 border-b-1 border-white rounded-t-2xl">
                    <div className="flex flex-row items-center gap-10">
                        <img src="/profile.png" width="100px" />
                        <span>Username</span>
                    </div>
                    <div>
                        My name is Shail, a Dota 2 player from Pakistan, with 2
                        years of experience in competitive and casual matches. I
                        specialize in carry and support roles, focusing on
                        high-level strategy, coordination, and decision-making.
                        I carry my team so good that they end up cursing me at
                        the end of every game. Sometimes people wonder if I'm
                        playing as carry with support hero or as support with
                        carry hero. I’m passionate about improving as both a
                        player and teammate and am always open to scrims or new
                        team opportunities.
                    </div>
                    <button className="p-3 font-semibold rounded-md cursor-pointer bg-green-700 hover:bg-green-500 text-white shadow trasition w-fit">
                        Save
                    </button>
                </section>
                <section className="flex flex-row">
                    <div className="w-1/4 p-5 border-r-1 border-white">
                        <h4 className="mb-5">Your Games</h4>
                        <div className="flex flex-col gap-5">
                            <PrimaryBtn text="Dota 2" />
                            <PrimaryBtn text="Valorant" />
                            <PrimaryBtn text="Counter Strike" />
                            <PrimaryBtn text="PUBG" />
                            <PrimaryBtn text="FreeFire" />
                            <PrimaryBtn text="+" />
                        </div>
                    </div>
                    <div className="w-3/4 p-5">
                        <h3 className="mb-5">Dota 2</h3>
                        <div className="mb-5">
                            <h4 className="mb-3">Information</h4>
                            <div className="flex flex-col gap-5">
                                {attributes.map((attr, i) => {
                                    const attribute = Object.keys(attr)[0];
                                    const value = Object.values(attr)[0];
                                    return (
                                        <div
                                            key={i}
                                            className="flex flex-row gap-10 items-center"
                                        >
                                            <Input
                                                name={`attr_${i}`}
                                                value={attribute}
                                                type="text"
                                                placeholder="Enter name of attribute e.g., Rank"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) => {
                                                    var newAttributes = [
                                                        ...attributes,
                                                    ];
                                                    newAttributes[i] = {
                                                        [e.target.value]: value,
                                                    };
                                                    setAttributes(
                                                        newAttributes,
                                                    );
                                                }}
                                            />
                                            <Input
                                                name={`value_${i}`}
                                                value={value}
                                                type="text"
                                                placeholder="Enter value of attribute e.g., Silver"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) => {
                                                    var newAttributes = [
                                                        ...attributes,
                                                    ];
                                                    newAttributes[i] = {
                                                        [attribute]:
                                                            e.target.value,
                                                    };
                                                    setAttributes(
                                                        newAttributes,
                                                    );
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    var newAttributes = [
                                                        ...attributes,
                                                    ];
                                                    newAttributes.splice(i, 1);
                                                    setAttributes(
                                                        newAttributes,
                                                    );
                                                }}
                                                className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-red-700 text-white shadow hover:bg-red-500 transition"
                                            >
                                                X
                                            </button>
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={() => {
                                        setAttributes([
                                            ...attributes,
                                            { "": "" },
                                        ]);
                                    }}
                                    className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-emerald-700 text-white shadow hover:bg-emerald-500 transition"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="mb-5">
                            <h4 className="mb-3">Links</h4>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-5">
                                    {links.map((attr, i) => {
                                        const attribute = Object.keys(attr)[0];
                                        const value = Object.values(attr)[0];
                                        return (
                                            <div
                                                key={i}
                                                className="flex flex-row gap-10 items-center"
                                            >
                                                <Input
                                                    name={`attr_${i}`}
                                                    value={attribute}
                                                    type="text"
                                                    placeholder="Enter name of attribute e.g., Rank"
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) => {
                                                        var newLinks = [
                                                            ...links,
                                                        ];
                                                        newLinks[i] = {
                                                            [e.target.value]:
                                                                value,
                                                        };
                                                        setLinks(newLinks);
                                                    }}
                                                />
                                                <Input
                                                    name={`value_${i}`}
                                                    value={value}
                                                    type="text"
                                                    placeholder="Enter value of attribute e.g., Silver"
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>,
                                                    ) => {
                                                        var newLinks = [
                                                            ...links,
                                                        ];
                                                        newLinks[i] = {
                                                            [attribute]:
                                                                e.target.value,
                                                        };
                                                        setLinks(newLinks);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        var newLinks = [
                                                            ...links,
                                                        ];
                                                        newLinks.splice(i, 1);
                                                        setLinks(newLinks);
                                                    }}
                                                    className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-red-700 text-white shadow hover:bg-red-500 transition"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        );
                                    })}
                                    <button
                                        onClick={() => {
                                            setLinks([...links, { "": "" }]);
                                        }}
                                        className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-emerald-700 text-white shadow hover:bg-emerald-500 transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
