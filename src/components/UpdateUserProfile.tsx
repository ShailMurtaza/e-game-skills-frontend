"use client";
import { useUI } from "@/context/UIContext";
import { Input, PrimaryBtn } from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import AvatarUploader from "@/components/AvatarUploader";
import { FaEye } from "react-icons/fa";
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
        <section className="flex flex-col gap-5 p-5 border-b border-white rounded-t-2xl">
            <div className="flex lg:flex-row flex-col justify-around items-center gap-10">
                <AvatarUploader
                    onFileSelect={setAvatarFile}
                    currentAvatar={
                        userProfile?.avatar
                            ? `${API_URL}/users/avatar/${userProfile.avatar}`
                            : "profile.png"
                    }
                />
                <div className="flex flex-col w-full lg:w-fit">
                    <div className="mb-2 font-bold">Enter Username</div>
                    <Input
                        name="username"
                        placeholder="Username"
                        type="text"
                        value={username}
                        className="w-full lg:w-fit"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-col w-full lg:w-fit">
                    <div className="mb-2 font-bold">Enter Country</div>
                    <Input
                        name="country"
                        placeholder="Country"
                        type="text"
                        value={userCountry ?? ""}
                        className="w-full lg:w-fit"
                        onChange={(e) => {
                            setUserCountry(e.target.value);
                        }}
                    />
                </div>

                <div className="flex flex-col w-full lg:w-fit">
                    <div className="mb-2 font-bold">Enter Region</div>
                    <Input
                        name="region"
                        placeholder="Region"
                        type="text"
                        value={userRegion ?? ""}
                        className="w-full lg:w-fit"
                        onChange={(e) => {
                            setUserRegion(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div>
                <div className="mb-2 font-bold">Edit Description</div>
                <textarea
                    className="w-full text-white p-4 border border-white rounded-xl outline-none"
                    defaultValue={userDescription ?? ""}
                    rows={4}
                    placeholder="Enter your description."
                    onChange={(e) => {
                        setUserDescription(e.target.value);
                    }}
                />
            </div>
            <div className="flex flex-row gap-5">
                <PrimaryBtn
                    text="Save"
                    className="w-fit"
                    onClick={handleSaveProfile}
                />
                <Link
                    href={`/portfolio/${userProfile?.id}`}
                    target="_blank"
                    className="flex flex-row items-center gap-3 p-3 rounded-md outline-none cursor-pointer bg-[#0b5ed7] text-gray-100 hover:bg-[#053470] transition"
                >
                    <FaEye /> Preview Portfolio
                </Link>
            </div>
        </section>
    );
}
