export type SearchResult = {
    id: number;
    username: string;
    avatar: string | null;
    user_games: {
        attribute_values: {
            game_attribute_id: number;
            value: string;
        }[];
    }[];
}[];
