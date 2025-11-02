"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitBtn, SelectButton } from "@/components/Auth";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/authContext";
import { LoadingComponent } from "@/components/Loading";
import RoleProfilePaths from "@/lib/RoleProfilePaths";

export default function Auth() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { setLoading, notify } = useUI();
    const router = useRouter();

    const [accountType, setAccountType] = useState<"player" | "team">("player");
    const { isLoading, isAuthenticated, userRole } = useAuth();

    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userRole != "pending"
    ) {
        return <LoadingComponent />;
    }

    return (
        <main className="pt-[150px] mx-10 min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <div className="relative w-full max-w-3xl bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_20px_2px_rgba(99,102,241,0.2)] overflow-hidden">
                <section className="grid grid-cols-2 gap-10 justify-center items-center p-8">
                    <div className="flex flex-col gap-10">
                        <h3 className="text-2xl font-bold text-gray-100">
                            Select Your Role
                        </h3>
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
                        <SubmitBtn
                            text="Save"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    if (!accountType)
                                        throw new Error("Select Role");
                                    const res = await fetch(
                                        `${API_URL}/users/set-role/${accountType}`,
                                        {
                                            method: "GET",
                                            credentials: "include", // This sends the cookie
                                        },
                                    );
                                    const data = await res.json();
                                    if (!res.ok)
                                        throw new Error(
                                            data.message || "Failed",
                                        );

                                    notify("Your Role Has been set", "success");
                                    router.push(RoleProfilePaths[accountType]);
                                    return true;
                                } catch (err: any) {
                                    notify(err.message, "error");
                                    setLoading(false);
                                    return false;
                                }
                            }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-semibold text-white">
                            Thanks for Signing Up in E Game Skills
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Finish your profile by entering these details.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
