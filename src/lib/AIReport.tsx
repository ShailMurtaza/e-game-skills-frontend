export type AIReport = {
    id: number;
    targetId: number;
    severity: "low" | "medium" | "high";
    note: string;
    createdAt: string;
};
