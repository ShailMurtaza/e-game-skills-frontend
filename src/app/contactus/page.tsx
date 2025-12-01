"use client";

import { InputAuth } from "@/components/Auth";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import React, { useState, useEffect } from "react";

function SubmitBtn({ text }: { text: string }) {
    return (
        <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
        >
            {text}
        </button>
    );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Auth() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { setLoading, notify } = useUI();
    const { isAuthenticated, userProfile } = useAuth();
    useEffect(() => {
        if (isAuthenticated && userProfile?.email && userProfile?.username) {
            setEmail(userProfile.email);
            setName(userProfile.username);
        }
    }, [isAuthenticated, userProfile]);
    async function submitMessage() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/contacts`, {
                method: "POST",
                body: JSON.stringify({
                    email: email.trim(),
                    name: name.trim(),
                    message: message.trim(),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            notify(data.message, "success");
            setEmail("");
            setName("");
            setMessage("");
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }
    return (
        <main className="pt-[150px] md:mx-10 mx-4 min-h-screen flex items-center justify-center bg-black text-gray-100">
            <div className="w-full lg:max-w-fit bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_20px_2px_rgba(99,102,241,0.2)] overflow-x-hidden">
                <section className="flex flex-row gap-10 justify-center p-8 min-h-[520px]">
                    <form
                        className="flex flex-col justify-between w-full"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitMessage();
                        }}
                    >
                        <h3 className="font-bold text-gray-100">Contact Us</h3>
                        <div className="flex lg:flex-row flex-col justify-center gap-5 my-5">
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="Enter you Email address"
                                value={email}
                                disabled={isAuthenticated}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <InputAuth
                                name="name"
                                type="text"
                                label="Name"
                                placeholder="Enter your name"
                                value={name}
                                disabled={isAuthenticated}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setName(e.target.value);
                                }}
                            />
                        </div>
                        <div className="my-5">
                            <label className="block text-sm font-medium text-gray-300">
                                Message
                            </label>
                            <textarea
                                name="msg"
                                placeholder="Type your message"
                                className="w-full min-h-[200px] mt-2 block rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                            ></textarea>
                        </div>
                        <SubmitBtn text="Submit" />
                    </form>
                </section>
            </div>
        </main>
    );
}
