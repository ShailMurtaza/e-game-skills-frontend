export type Report = {
    id: number;
    reporter_id: number;
    target_id: number;
    reason: string;
    description: string;
    is_reviewed: boolean;
    timestamp: Date;
};
