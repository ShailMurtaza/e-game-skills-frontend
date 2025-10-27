export type GameAttr = Record<string, "text" | "number" | "date">;

export type Game = {
    id: number;
    title: string;
    attributes: GameAttr[];
};
