export type Report = {
    id: number;
    reporterId: number;
    targetId: number;
    reason: "spam" | "abuse" | "impersonation";
    note: string;
    createdAt: string;
};
