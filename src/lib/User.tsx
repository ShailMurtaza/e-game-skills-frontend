export type User = {
    id: number;
    email: string;
    username: string;
    role: "player" | "team" | "admin";
    banned: boolean;
    isAdmin: boolean;
    notes: string;
    createdAt: string;
};
