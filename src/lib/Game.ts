export type GameAttr = {
    id?: number;
    name: string;
    game_id: number;
    action?: "create" | "update" | "delete";
};

export type Game = {
    id?: number;
    name: string;
    attributes: GameAttr[];
};
