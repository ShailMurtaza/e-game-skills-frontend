export type AttributesType = {
    id?: number;
    name?: string;
    value: string;
};

// Name here is optional because name is only used in Attributes components to create new Attribute or just to show attribute
// It is not compatible iwht UserGames/UserGameType
export type InformationAttributeType = {
    id: number;
    game_attribute_id?: number;
    name?: string;
    user_game_id?: number;
    value: string;
};
