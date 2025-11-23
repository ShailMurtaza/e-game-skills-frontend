// For user profile
export type UserProfile = {
    id?: number;
    email?: string;
    username?: string;
    region?: string;
    country?: string;
    role?: "player" | "team" | "admin" | "pending";
    region_id?: number;
    avatar?: string;
    description?: string;
};

// For admin
export type User = UserProfile & {
    banned?: boolean;
    notes?: string;
};

export type PublicUser = {
    username: string;
    email: string;
    country: string;
    region: string;
    avatar: string;
    description: string;
};
