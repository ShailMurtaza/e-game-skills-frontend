"use client";
import { useState } from "react";
export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-[0_0_15px_2px_white] overflow-hidden">
                <div
                    className={`flex flex-row relative h-[520px] md:h-[420px] w-[200%] transition-transform duration-700 ease-in-out ${isLogin ? "translate-x-0" : "-translate-x-1/2"}`}
                >
                    <section className="flex flex-row gap-10 justify-center p-8 w-1/2">
                        <form className="flex flex-col justify-between w-1/2">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Sign in to your account
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-2 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none p-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-2 block rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none p-3"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" name="remember" />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Forgot?
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:opacity-95 transition"
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Log in to continue where you left off.
                            </p>
                        </div>
                    </section>
                    <section className="flex flex-row gap-10 justify-center p-8 w-1/2">
                        <form className="flex flex-col justify-between w-1/2">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Create your account
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-2 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none p-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-2 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none p-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-2 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none p-3"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:opacity-95 transition"
                                >
                                    Create account
                                </button>
                            </div>
                        </form>
                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Create New Account
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Join us — it only takes a minute
                            </p>
                        </div>
                    </section>
                </div>
                {/* Footer quick switch (redundant but handy) */}
                <div className="flex items-center justify-center gap-4 p-4 border-t text-sm text-gray-600">
                    <span>
                        {isLogin
                            ? "Don’t have an account?"
                            : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        {isLogin ? "Create one" : "Sign in"}
                    </button>
                </div>
            </div>
        </main>
    );
}
