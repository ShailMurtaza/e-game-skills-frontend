"use client";
import { useUI } from "@/context/UIContext";
import { Input, PrimaryBtn } from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import AvatarUploader from "@/components/AvatarUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateUserProfile() {
    const { userProfile } = useAuth();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [username, setUsername] = useState<string>("");
    const [userDescription, setUserDescription] = useState<string | null>(null);
    const [regions, setRegions] = useState<
        { id: number; name: string }[] | null
    >();
    const [userRegion, setUserRegion] = useState<number | null>(null);
    const { setLoading, notify } = useUI();
    useEffect(() => {
        // Fetch regions
        fetch(`${API_URL}/region`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => setRegions(data));
    }, []);

    useEffect(() => {
        setUsername(userProfile?.username ?? "");
        setUserDescription(userProfile?.description ?? null);
        setUserRegion(userProfile?.region_id ?? null);
    }, [userProfile]);

    const handleSaveProfile = async () => {
        setLoading(true);
        const form = new FormData();
        if (avatarFile) form.append("avatar", avatarFile);
        form.append("username", username);
        if (userDescription) form.append("description", userDescription);
        if (userRegion) form.append("region_id", userRegion.toString());

        try {
            const res = await fetch(`${API_URL}/users/update_profile`, {
                method: "POST",
                credentials: "include",
                body: form,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? "Error");
            notify("Profile Updated");
        } catch (err: any) {
            notify(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-5 p-5 border-b border-white rounded-t-2xl">
            <div className="flex flex-row justify-around items-center gap-10">
                <AvatarUploader
                    onFileSelect={setAvatarFile}
                    currentAvatar={
                        userProfile?.avatar
                            ? `${API_URL}/users/avatar/${userProfile.avatar}`
                            : "profile.png"
                    }
                />
                <div className="flex flex-col">
                    <div className="mb-2 font-bold">Enter Username</div>
                    <Input
                        name="username"
                        placeholder="Username"
                        type="text"
                        value={username}
                        className="w-fit"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <div className="mb-2 font-bold">Select Region</div>
                    <select
                        className="block rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-white-500 focus:border-indigo-500 focus:outline-none p-3"
                        value={userRegion ?? ""}
                        onChange={(e) => setUserRegion(Number(e.target.value))}
                    >
                        {regions &&
                            regions.map((r) => {
                                return (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                );
                            })}
                    </select>
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
            <PrimaryBtn
                text="Save"
                className="w-fit"
                onClick={handleSaveProfile}
            />
        </section>
    );
}
