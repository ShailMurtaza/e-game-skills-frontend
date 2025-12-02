"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSignup from "@/utils/handleSignUp";
import useGenerateOtp from "@/utils/handleGenerateOtp";
import useVerifyAccount from "@/utils/handleVerifyAccount";
import useRecoverAccount from "@/utils/handleRecoverAccount";
import useSignin from "@/utils/handleSignin";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/authContext";
import {
    InputAuth,
    SubmitBtn,
    SelectButton,
    LoginButton,
} from "@/components/Auth";
import { LoadingComponent } from "@/components/Loading";

export default function AuthPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { setLoading, notify } = useUI();
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action") ?? "signin";
    const error = searchParams.get("error");

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

    const translations: Record<string, string> = {
        "": "-translate-x-2/4",
        recover: "translate-x-0",
        verify: "-translate-x-1/4",
        signin: "-translate-x-2/4",
        signup: "-translate-x-3/4",
    };

    const translation = translations[action ?? ""];

    useEffect(() => {
        setLoading(false);
        if (error) {
            notify(error, "error");
        }
    }, []);

    // Reset values after router/action is changed
    useEffect(() => {
        setName("");
        setCodeSent(false);
        setCode("");
        setPassword("");
        setConfirmPassword("");
    }, [action]);
    const { isLoading, isAuthenticated } = useAuth();
    if (isLoading || isAuthenticated) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[150px] mx-3 lg:mx-10 min-h-screen flex items-center justify-center p-6 bg-gray-800 text-purple-900">
            <div className="relative w-full max-w-3xl bg-yellow-300 rounded-none overflow-hidden">
                <div
                    className={`grid grid-cols-4 relative h-[620px] md:h-[520px] w-[400%] transition-transform duration-700 ease-in-out ${translation}`}
                >
                    {/* ---------- Recovery Section ---------- */}
                    <section className="flex flex-row gap-5 justify-start p-4 bg-green-100">
                        <div
                            className={`flex flex-col sm:w-1/2 w-full  ${codeSent ? "justify-center" : "justify-start gap-4"}`}
                        >
                            <h3 className="text-2xl font-normal text-red-600">
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
                        <div className="hidden sm:flex flex-col h-full justify-center items-center w-1/2 bg-blue-200">
                            <h2 className="text-2xl font-semibold text-orange-700">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-black">
                                Help us find your account.
                            </p>
                        </div>
                    </section>

                    {/* ---------- Verification Section ---------- */}
                    <section className="flex flex-row gap-5 justify-start p-4 bg-purple-100">
                        <form
                            className="flex flex-col justify-start gap-4 sm:w-1/2 w-full"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <h3 className="text-2xl font-normal text-grey-600">
                                Enter Email to get verfication code
                            </h3>
                            <InputAuth
                                name="email"
                                type="email"
                                label="Email"
                                value={email}
                                disabled={true}
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
                        <div className="hidden sm:flex flex-col h-full justify-center items-center w-1/2 bg-red-200">
                            <h2 className="text-2xl font-semibold text-green-800">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-yellow-800">
                                Verify your Account
                            </p>
                        </div>
                    </section>

                    {/* ---------- Login Section ---------- */}
                    <section className="flex flex-row gap-5 justify-start p-4 bg-orange-100">
                        <form
                            className="flex flex-col justify-between sm:w-1/2 w-full"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const result = await handleSignin(
                                    email,
                                    password,
                                );
                                if (result.result) {
                                    setEmail("");
                                    setPassword("");
                                } else if (!result.result && result.action) {
                                    router.push(`?action=${result.action}`);
                                }
                                return;
                            }}
                        >
                            <h3 className="text-2xl font-normal text-blue-700">
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

                            <div className="flex items-center justify-between text-black">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="accent-red-600"
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-green-400 hover:text-red-300 hover:underline"
                                    onClick={() => {
                                        router.push("?action=recover");
                                    }}
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="flex flex-row gap-2 justify-between">
                                <LoginButton
                                    provider="Google"
                                    onClick={() => {
                                        window.location.href = `${API_URL}/auth/google/login`;
                                    }}
                                />
                                <LoginButton
                                    provider="Discord"
                                    onClick={() => {
                                        setLoading(true);
                                        window.location.href = `${API_URL}/auth/discord/login`;
                                    }}
                                />
                            </div>

                            <SubmitBtn text="Log in" />
                        </form>

                        <div className="hidden sm:flex flex-col h-full justify-center items-center w-1/2 bg-pink-100">
                            <h2 className="text-2xl font-semibold text-blue-900">
                                Welcome Back
                            </h2>
                            <p className="mt-2 text-sm text-green-900">
                                Log in to continue where you left off.
                            </p>
                        </div>
                    </section>

                    {/* ---------- Signup Section ---------- */}
                    <section className="flex flex-row gap-5 justify-start px-4 py-3 bg-teal-100">
                        <form
                            className="flex flex-col justify-between sm:w-1/2 w-full"
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
                                    router.push("?action=verify");
                                }
                            }}
                        >
                            <h3 className="text-2xl font-normal text-purple-700">
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

                        <div className="hidden sm:flex flex-col h-full justify-center items-center w-1/2 bg-orange-200">
                            <h2 className="text-2xl font-semibold text-red-800">
                                Create New Account
                            </h2>
                            <p className="mt-2 text-sm text-blue-900">
                                Join us — it only takes a minute
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer switch */}
                <div className="flex items-center justify-center gap-4 p-4 text-sm text-red-600">
                    <span>
                        {action === "signin"
                            ? "Don’t have an account?"
                            : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => {
                            if (action === "signin")
                                router.push("?action=signup");
                            else router.push("?action=signin");
                        }}
                        className="text-green-400 font-medium hover:text-pink-300 hover:underline"
                    >
                        {action === "signin" ? "Create one" : "Sign in"}
                    </button>
                </div>
            </div>
        </main>
    );
}
