import { useUI } from "@/context/UIContext";
import { PrimaryBtn } from "./Dashboard";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateUserProfile({
    avatarFile,
    username,
    description,
    region,
}: {
    avatarFile: File | null;
    username: string;
    description: string | null;
    region: number | null;
}) {
    const { setLoading, notify } = useUI();

    const handleSaveProfile = async () => {
        setLoading(true);
        const form = new FormData();
        if (avatarFile) form.append("avatar", avatarFile);
        form.append("username", username);
        if (description) form.append("description", description);
        if (region) form.append("region_id", region.toString());

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
        <PrimaryBtn
            text="Save"
            className="w-fit"
            onClick={handleSaveProfile} // or () => handleSaveProfile() if you need params later
        />
    );
}
