"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function InputAuth({
    name,
    type,
    label,
}: {
    name: string;
    type: string;
    label: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>
            <input
                name={name}
                type={type}
                required
                className="mt-2 block w-full rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3"
            />
        </div>
    );
}

function SelectButton({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition border-1 border-solid border-indigo-600 ${
                selected
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700 border-gray-300 hover:bg-indigo-500"
            }`}
        >
            {label}
        </button>
    );
}

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

export default function Auth() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");

    const [accountType, setAccountType] = useState("Player");

    var translation = "";
    if (action === "recover") {
        translation = "translate-x-0";
    } else if (action === "signin") {
        translation = "-translate-x-1/3";
    } else if (action === "signup") {
        translation = "-translate-x-2/3";
    }
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <div className="relative w-full max-w-3xl bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_20px_2px_rgba(99,102,241,0.2)] overflow-hidden">
                <div
                    className={`flex flex-row relative h-[620px] md:h-[520px] w-[300%] transition-transform duration-700 ease-in-out ${translation}`}
                >
                    <section className="flex flex-row gap-10 justify-center p-8 w-1/3">
                        <form className="flex flex-col justify-between w-1/2">
                            <h3 className="text-2xl font-bold text-gray-100">
                                Enter Email to get verfication code
                            </h3>
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                            />
                            <InputAuth name="code" type="text" label="Code" />
                            <SubmitBtn text="Get Code" />
                        </form>
                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-white">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Help us find your account.
                            </p>
                        </div>
                    </section>
                    {/* ---------- Login Section ---------- */}
                    <section className="flex flex-row gap-10 justify-center p-8 w-1/3">
                        <form className="flex flex-col justify-between w-1/2">
                            <h3 className="text-2xl font-bold text-gray-100">
                                Sign in to your account
                            </h3>

                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                            />
                            <InputAuth
                                name="password"
                                type="password"
                                label="Password"
                            />

                            <div className="flex items-center justify-between text-gray-400">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="accent-indigo-600"
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
                                    onClick={() => {
                                        router.push("?action=recover");
                                    }}
                                >
                                    Forgot?
                                </button>
                            </div>

                            <SubmitBtn text="Log in" />
                        </form>

                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-white">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Log in to continue where you left off.
                            </p>
                        </div>
                    </section>

                    {/* ---------- Signup Section ---------- */}
                    <section className="flex flex-row gap-10 justify-center p-8 w-1/3">
                        <form className="flex flex-col justify-between w-1/2">
                            <h3 className="text-2xl font-bold text-gray-100">
                                Create your account
                            </h3>

                            <InputAuth
                                name="name"
                                type="text"
                                label="Full name"
                            />
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                            />
                            <InputAuth
                                name="password"
                                type="password"
                                label="Password"
                            />
                            <div className="w-full flex flex-row gap-2">
                                <SelectButton
                                    label="Player"
                                    selected={accountType === "Player"}
                                    onClick={() => setAccountType("Player")}
                                />
                                <SelectButton
                                    label="Team"
                                    selected={accountType === "Team"}
                                    onClick={() => setAccountType("Team")}
                                />
                            </div>

                            <SubmitBtn text="Create account" />
                        </form>

                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-white">
                                Create New Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Join us — it only takes a minute
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer switch */}
                <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-800 text-sm text-gray-400">
                    <span>
                        {action === "signin"
                            ? "Don’t have an account?"
                            : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => {
                            action === "signin"
                                ? router.push("?action=signup")
                                : router.push("?action=signin");
                        }}
                        className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline"
                    >
                        {action === "signin" ? "Create one" : "Sign in"}
                    </button>
                </div>
            </div>
        </main>
    );
}
