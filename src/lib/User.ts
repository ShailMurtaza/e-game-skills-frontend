// For user profile
export type UserProfile = {
    userId: number;
    email: string;
    username: string;
    role: "player" | "team" | "admin" | "pending";
    region_id: number;
    avatar: string;
    description: string;
};

// For admin
export type User = UserProfile & {
    banned: boolean;
    notes: string;
};
