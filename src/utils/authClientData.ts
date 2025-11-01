const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getAuthData(): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        return data;
    } catch (err: any) {
        return false;
    }
}
