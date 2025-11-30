import type { NextConfig } from "next";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL(`${API_URL}/users/avatar/**`)],
    },
};

export default nextConfig;
