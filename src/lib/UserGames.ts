import { AttributesType, InformationAttributeType } from "./Attributes";

export type WinsLossType = {
    type: "Win" | "Loss";
    date: string;
    value: number;
};
type UserGameType = {
    id?: number;
    game_id: number;
    user_id: number;
    Links: {
        id: number;
        name: string;
        user_game_id: number;
        value: string;
    }[];
    attribute_values: {
        id: number;
        game_attribute_id: number;
        user_game_id: number;
        value: string;
        game_attribute: {
            id: number;
            name: string;
            game_id: number;
        };
    }[];
    custom_attributes: {
        id: number;
        name: string;
        user_game_id: number;
        value: string;
    }[];
    game?: { id: number; name: string };
};
export type UserGameSearch = UserGameType & { WinsLoss?: WinsLossType[] };
export type UserGameSearchFormated = UserGameType & {
    wins: {
        date: string;
        value: number;
    }[];

    losses: {
        date: string;
        value: number;
    }[];
};

// All properties other than game_id are optional for Update type
export type UserGameTypeForUpdate = {
    id?: number;
    game_id?: number;
    user_id?: number;
    Links?: {
        id?: number;
        name?: string;
        user_game_id?: number;
        value: string;
        game_attribute_id?: number;
    }[];
    attribute_values?: InformationAttributeType[];
    custom_attributes?:
        | {
              id: number;
              name: string;
              user_game_id: number;
              value: string;
          }[]
        | AttributesType[];
    game?: { id: number; name: string };
    WinsLoss?: WinsLossType[];
};
