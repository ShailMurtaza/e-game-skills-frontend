"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSignup from "@/utils/handleSignUp";
import useGenerateOtp from "@/utils/handleGenerateOtp";
import useVerifyAccount from "@/utils/handleVerifyAccount";
import useRecoverAccount from "@/utils/handleRecoverAccount";
import useSignin from "@/utils/handleSignin";
import { useUI } from "@/context/UIContext";
import { InputAuth, SubmitBtn, SelectButton } from "@/components/Auth";

export default function Auth() {
    const { setLoading, notify } = useUI();
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");

    const [accountType, setAccountType] = useState<"player" | "team">("player");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);

    const { handleSignup } = useSignup();
    const { handleGenerateOtp } = useGenerateOtp();
    const { handleVerifyAccount } = useVerifyAccount();
    const { handleRecoverAccount } = useRecoverAccount();
    const { handleSignin } = useSignin();

    var translation = "";
    if (action === "recover") {
        translation = "translate-x-0";
    } else if (action === "verify") {
        translation = "-translate-x-1/4";
    } else if (action === "signin") {
        translation = "-translate-x-2/4";
    } else if (action === "signup") {
        translation = "-translate-x-3/4";
    }
    return (
        <main className="pt-[150px] mx-10 min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <div className="relative w-full max-w-3xl bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_20px_2px_rgba(99,102,241,0.2)] overflow-hidden">
                <div
                    className={`grid grid-cols-4 relative h-[620px] md:h-[520px] w-[400%] transition-transform duration-700 ease-in-out ${translation}`}
                >
                    {/* ---------- Recovery Section ---------- */}
                    <section className="flex flex-row gap-10 justify-center p-8">
                        <div
                            className={`flex flex-col w-1/2 ${codeSent ? "justify-between" : "justify-start gap-10"}`}
                        >
                            <h3 className="text-2xl font-bold text-gray-100">
                                Enter Email to get verfication code
                            </h3>
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <SubmitBtn
                                text={`${codeSent ? "Resend" : "Send"} Code`}
                                onClick={async () => {
                                    if (await handleGenerateOtp(email)) {
                                        setCodeSent(true);
                                    } else {
                                        setCodeSent(false);
                                    }
                                }}
                            />
                            {codeSent ? (
                                <>
                                    <InputAuth
                                        name="code"
                                        type="text"
                                        label="Code"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                        }}
                                    />
                                    <InputAuth
                                        name="password"
                                        type="password"
                                        label="Password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                    />
                                    <InputAuth
                                        name="confirmPassword"
                                        type="password"
                                        label="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                        }}
                                    />
                                    <SubmitBtn
                                        text="Recover"
                                        onClick={async () => {
                                            if (password != confirmPassword) {
                                                notify(
                                                    "Passwords do not match",
                                                    "error",
                                                );
                                                return;
                                            }
                                            if (
                                                await handleRecoverAccount(
                                                    email,
                                                    code,
                                                    password,
                                                )
                                            )
                                                router.push("?action=signin");
                                        }}
                                    />
                                </>
                            ) : null}
                        </div>
                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-white">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Help us find your account.
                            </p>
                        </div>
                    </section>

                    {/* ---------- Verification Section ---------- */}
                    <section className="flex flex-row gap-10 justify-center p-8">
                        <form
                            className="flex flex-col justify-start gap-10 w-1/2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <h3 className="text-2xl font-bold text-gray-100">
                                Enter Email to get verfication code
                            </h3>
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <SubmitBtn
                                text={`${codeSent ? "Resend" : "Send"} Code`}
                                onClick={async () => {
                                    if (await handleGenerateOtp(email)) {
                                        setCodeSent(true);
                                    } else {
                                        setCodeSent(false);
                                    }
                                }}
                            />
                            {codeSent ? (
                                <>
                                    <InputAuth
                                        name="code"
                                        type="text"
                                        label="Code"
                                        value={code}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                        }}
                                    />
                                    <SubmitBtn
                                        text="Verify"
                                        onClick={async () => {
                                            if (
                                                await handleVerifyAccount(
                                                    email,
                                                    code,
                                                )
                                            )
                                                router.push("?action=signin");
                                        }}
                                    />
                                </>
                            ) : null}
                        </form>
                        <div className="flex flex-col h-full justify-center items-center w-1/2">
                            <h2 className="text-2xl font-semibold text-white">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Verify your Account
                            </p>
                        </div>
                    </section>
                    {/* ---------- Login Section ---------- */}
                    <section className="flex flex-row gap-10 justify-center p-8">
                        <form
                            className="flex flex-col justify-between w-1/2"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (await handleSignin(email, password)) {
                                    setEmail("");
                                    setPassword("");
                                }
                                return;
                            }}
                        >
                            <h3 className="text-2xl font-bold text-gray-100">
                                Sign in to your account
                            </h3>

                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <InputAuth
                                name="password"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
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
                    <section className="flex flex-row gap-10 justify-center p-8">
                        <form
                            className="flex flex-col justify-between w-1/2"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (password != confirmPassword) {
                                    notify("Passwords do not match");
                                    return;
                                }
                                if (
                                    await handleSignup(
                                        name,
                                        email,
                                        accountType,
                                        password,
                                    )
                                ) {
                                    setName("");
                                    setPassword("");
                                    setConfirmPassword("");
                                    router.push("?action=verify");
                                }
                            }}
                        >
                            <h3 className="text-2xl font-bold text-gray-100">
                                Create your account
                            </h3>

                            <InputAuth
                                name="name"
                                type="text"
                                label="Full name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            <InputAuth
                                name="password"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputAuth
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <div className="w-full flex flex-row gap-2">
                                <SelectButton
                                    label="Player"
                                    selected={accountType === "player"}
                                    onClick={() => setAccountType("player")}
                                />
                                <SelectButton
                                    label="Team"
                                    selected={accountType === "team"}
                                    onClick={() => setAccountType("team")}
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
