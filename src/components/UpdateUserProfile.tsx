"use client";
import { useUI } from "@/context/UIContext";
import { Input, PrimaryBtn } from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import AvatarUploader from "@/components/AvatarUploader";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateUserProfile() {
    const { userProfile } = useAuth();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>("");
    const [userDescription, setUserDescription] = useState<string | null>(null);
    const [userCountry, setUserCountry] = useState<string | null>(null);
    const [userRegion, setUserRegion] = useState<string | null>(null);
    const { setLoading, notify } = useUI();

    useEffect(() => {
        setUsername(userProfile?.username ?? "");
        setUserDescription(userProfile?.description ?? null);
        setUserCountry(userProfile?.country ?? null);
        setUserRegion(userProfile?.region ?? null);
    }, [userProfile]);

    const handleSaveProfile = async () => {
        setLoading(true);
        const form = new FormData();
        if (avatarFile) form.append("avatar", avatarFile);
        form.append("username", username);
        if (userDescription) form.append("description", userDescription);
        if (userRegion) form.append("region", userRegion);
        if (userCountry) form.append("country", userCountry);

        try {
            const res = await fetch(`${API_URL}/users/update_profile`, {
                method: "POST",
                credentials: "include",
                body: form,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Error");
            notify("Profile Updated");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-8 p-4 border-4 border-red-600 rounded-t-2xl bg-black-200">
            <div className="flex flex-col lg:flex-row justify-around items-center gap-6">
                <AvatarUploader
                    onFileSelect={setAvatarFile}
                    currentAvatar={
                        userProfile?.avatar
                            ? `${API_URL}/users/avatar/${userProfile.avatar}`
                            : "profile.png"
                    }
                />

                <div className="flex flex-col w-full bg-green-300 p-2 border-2 border-blue-700">
                    <div className="mb-1 font-bold text-red-700">
                        Enter Username
                    </div>
                    <Input
                        name="username"
                        placeholder="Username"
                        type="text"
                        value={username}
                        className="w-full bg-pink-100 text-black border-2 border-purple-600 p-1"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-full bg-purple-200 p-2 border-2 border-yellow-700">
                    <div className="mb-1 font-bold text-blue-800">
                        Enter Country
                    </div>
                    <Input
                        name="country"
                        placeholder="Country"
                        type="text"
                        value={userCountry ?? ""}
                        className="w-full bg-orange-100 text-black border-2 border-red-600 p-1"
                        onChange={(e) => setUserCountry(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-full bg-pink-300 p-2 border-2 border-green-700">
                    <div className="mb-1 font-bold text-yellow-900">
                        Enter Region
                    </div>
                    <Input
                        name="region"
                        placeholder="Region"
                        type="text"
                        value={userRegion ?? ""}
                        className="w-full bg-cyan-100 text-black border-2 border-blue-600 p-1"
                        onChange={(e) => setUserRegion(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-4 bg-purple-100 p-2 border-2 border-red-700">
                <div className="mb-1 font-bold text-green-800">
                    Edit Description
                </div>
                <textarea
                    className="w-full p-3 text-black bg-yellow-300 border-2 border-blue-900 rounded-md outline-none"
                    defaultValue={userDescription ?? ""}
                    rows={4}
                    placeholder="Enter your description."
                    onChange={(e) => setUserDescription(e.target.value)}
                />
            </div>

            <div className="flex flex-row gap-4 mt-4">
                <PrimaryBtn
                    text="Save"
                    className="w-32 bg-pink-400 text-black border-2 border-red-700"
                    onClick={handleSaveProfile}
                />
                <Link
                    href={`/portfolio/${userProfile?.id}`}
                    target="_blank"
                    className="flex flex-row items-center gap-2 p-3 rounded-md outline-none cursor-pointer bg-lime-500 text-purple-900 border-2 border-blue-800"
                >
                    Preview Portfolio
                </Link>
            </div>
        </section>
    );
}
