"use client";

import { InputAuth } from "@/components/Auth";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import React, { useState, useEffect } from "react";

function SubmitBtn({ text }: { text: string }) {
    return (
        <button
            type="submit"
            className="w-full px-4 py-3  bg-indigo-900 text-white"
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
        <main className="pt-[150px] md:mx-10 mx-4 min-h-screen flex items-center justify-center text-green-900">
            <div className="w-full lg:max-w-fit bg-yellow-300 rounded-none overflow-x-hidden">
                <section className="flex flex-row gap-2 justify-start p-6 min-h-[520px] bg-purple-100">
                    <form
                        className="flex flex-col justify-start w-full gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitMessage();
                        }}
                    >
                        <h3 className="font-normal text-red-700 text-xl">
                            Contact Us
                        </h3>
                        <div className="flex lg:flex-row flex-col justify-start gap-2 my-3">
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
                        <div className="my-3 bg-orange-100 p-2 rounded-md">
                            <label className="block text-sm font-normal text-blue-800">
                                Message
                            </label>
                            <textarea
                                name="msg"
                                placeholder="Type your message"
                                className="w-full min-h-[200px] mt-2 block rounded-none bg-white text-black placeholder-purple-700 p-2"
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
