"use client";
import { PrimaryBtn, Attributes, DangerBtn } from "@/components/Dashboard";
import { AttributesType, InformationAttributeType } from "@/lib/Attributes";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import { useEffect, useState } from "react";
import { LoadingComponent } from "@/components/Loading";
import UpdateUserProfile from "@/components/UpdateUserProfile";
import { MdDeleteOutline } from "react-icons/md";
import { UserGameTypeForUpdate, WinsLossType } from "@/lib/UserGames";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserDashboard() {
    const { setLoading, notify } = useUI();
    const [AllGames, setAllGames] = useState<
        {
            id: number;
            name: string;
            attributes: { id: number; game_id: number; name: string }[];
        }[]
    >([]);
    const [userGames, setUserGames] = useState<UserGameTypeForUpdate[]>([]);
    const [selectedGame, setSelectedGame] = useState<number | null>(null);
    const [userGameDelete, setUserGameDelete] = useState<number | null>(null);
    useEffect(() => {
        // Set loading to false so that if previous redirect set it to true, it doesn't keep showing loading
        setLoading(false);
        // Fetch Games
        fetch(`${API_URL}/games`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => setAllGames(data));
        // Fetch Games
        fetch(`${API_URL}/users-games`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setUserGames(data));
    }, []);
    const [Information, setInformation] = useState<InformationAttributeType[]>(
        [],
    );
    const [AdditionalInformation, setAdditionalInformation] = useState<
        AttributesType[]
    >([]);
    const [Links, setLinks] = useState<AttributesType[]>([]);
    const [Wins, setWins] = useState<AttributesType[]>([]);
    const [Loss, setLoss] = useState<AttributesType[]>([]);

    const { isLoading, isAuthenticated, userProfile } = useAuth();

    const [selectedGameName, setSelectedGameName] = useState("");
    useEffect(() => {
        const selected_game = AllGames.find((game) => game.id == selectedGame);
        if (selected_game) {
            setSelectedGameName(selected_game.name);
            const user_selected_game = userGames.find(
                (user_game) => user_game.game_id === selected_game.id,
            );
            if (!user_selected_game) return;
            const user_links: AttributesType[] = [];
            (user_selected_game.Links ?? []).map((link: AttributesType) => {
                user_links.push({ name: link.name, value: link.value });
            });
            const custom_attributes: AttributesType[] = [];
            (user_selected_game.custom_attributes ?? []).map(
                (attr: AttributesType) => {
                    custom_attributes.push({
                        name: attr.name,
                        value: attr.value,
                    });
                },
            );
            // Separate Wins and Loss
            const wins: AttributesType[] = [];
            const loss: AttributesType[] = [];
            (user_selected_game.WinsLoss ?? []).map((attr: WinsLossType) => {
                const date = new Date(attr.date).toISOString().split("T")[0];
                if (attr.type == "Win")
                    wins.push({
                        name: date,
                        value: attr.value.toString(),
                    });
                else
                    loss.push({
                        name: date,
                        value: attr.value.toString(),
                    });
            });
            const gameAttributes: InformationAttributeType[] = [];
            (selected_game.attributes ?? []).map(
                (attr: { id: number; game_id: number; name: string }) => {
                    // Initialize with empty string
                    let value = "";
                    const attribute_value = (
                        user_selected_game.attribute_values ?? []
                    ).find(
                        (attr_value: InformationAttributeType) =>
                            attr_value.game_attribute_id === attr.id,
                    );
                    // If attribute value already exists then assign a value
                    if (attribute_value) value = attribute_value.value;
                    gameAttributes.push({
                        id: attr.id,
                        game_attribute_id: attr.id,
                        user_game_id: attr.game_id,
                        name: attr.name,
                        value: value,
                    });
                },
            );
            setLinks(user_links);
            setAdditionalInformation(custom_attributes);
            setWins(wins);
            setLoss(loss);
            setInformation(gameAttributes);
        }
    }, [selectedGame]);

    async function handleDeleteUserGame(game_id: number) {
        setLoading(true);
        if (selectedGame == game_id) setSelectedGame(null);
        // Check if this game doesn't exist in database by checking if 'id' exists of not
        if (
            !userGames
                ?.find((game) => game_id === game.game_id)
                ?.hasOwnProperty("id")
        ) {
            // Just remove from userGames state variable
            setUserGames(
                userGames.filter((user_game) => user_game.game_id !== game_id),
            );
            setLoading(false);
            setUserGameDelete(null);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/users-games/${game_id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");

            notify(data.message, "success");
            setUserGames(
                userGames.filter((user_game) => user_game.game_id !== game_id),
            );
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setUserGameDelete(null);
            setLoading(false);
        }
    }

    async function handleGameSave() {
        if (
            Information.find((attr) => {
                return attr.value.trim().length == 0;
            })
        ) {
            notify("Fill All Important Information", "error");
            return;
        }
        // Save data locally before sending it
        const newUserGames = userGames.map((game) => {
            if (game.game_id === selectedGame) {
                return {
                    ...game,
                    attribute_values: Information,
                    custom_attributes: AdditionalInformation,
                    Links: Links,
                    WinsLoss: [
                        ...Wins.map((win) => {
                            return {
                                date: win.name,
                                value: Number(win.value),
                                type: "Win",
                            } as WinsLossType;
                        }),
                        ...Loss.map((loss) => {
                            return {
                                date: loss.name,
                                value: Number(loss.value),
                                type: "Loss",
                            } as WinsLossType;
                        }),
                    ],
                };
            } else {
                return game;
            }
        });
        setUserGames(newUserGames);
        // Send PUT request to save data
        const allData = {
            game_id: selectedGame,
            UserGameAttributeValue: Information,
            UserGameCustomAttribute: AdditionalInformation,
            UserGameLinks: Links,
            Wins: Wins,
            Loss: Loss,
        };
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users-games/saveAllData`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(allData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");
            notify(data.message, "success");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";
            notify(message, "error");
        } finally {
            setLoading(false);
        }
    }

    if (
        isLoading ||
        (!isLoading && !isAuthenticated) ||
        userProfile?.role != "player"
    ) {
        return <LoadingComponent />;
    }
    return (
        <main className="pt-[120px] mx-4 lg:mx-6 bg-[#111111] text-[#d0d0d0]">
            {userGameDelete && (
                <DeleteConfirmDialog
                    onCancel={() => {
                        setUserGameDelete(null);
                    }}
                    onDelete={() => {
                        handleDeleteUserGame(userGameDelete);
                    }}
                />
            )}

            <div className="border border-gray-600 rounded-xl bg-[#0f0f0f]/70">
                <UpdateUserProfile />

                <section className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/4 p-4 border-b lg:border-r lg:border-b-0 border-gray-700 bg-[#1a1a1a]/30">
                        <h4 className="mb-4 text-gray-200/80 tracking-wider">
                            Your Games
                        </h4>

                        <div className="flex flex-col gap-4">
                            {userGames.map((g) => {
                                const game_id = g.game_id;
                                const game = AllGames.find(
                                    (game) => game_id == game.id,
                                );
                                if (game)
                                    return (
                                        <div
                                            key={game.id}
                                            className="flex flex-row w-full gap-2"
                                        >
                                            <PrimaryBtn
                                                text={game.name}
                                                active={
                                                    game.id === selectedGame
                                                }
                                                onClick={() => {
                                                    setSelectedGame(game.id);
                                                }}
                                                className="w-full bg-[#222]/70 hover:bg-[#333]"
                                            />
                                            <DangerBtn
                                                onClick={() => {
                                                    setUserGameDelete(game.id);
                                                }}
                                                className="bg-[#440000]/60 hover:bg-[#550000]"
                                            >
                                                <MdDeleteOutline size={18} />
                                            </DangerBtn>
                                        </div>
                                    );
                            })}

                            <select className="p-2 font-medium cursor-pointer rounded-md bg-[#1b1b1b] border border-gray-600 text-gray-300 hover:bg-[#2a2a2a] shadow-sm">
                                <option className="bg-[#1b1b1b]">
                                    Add New Game
                                </option>
                                {AllGames.filter((game) => {
                                    return !userGames.find((user_game) => {
                                        return game.id === user_game.game_id;
                                    });
                                }).map((game) => {
                                    return (
                                        <option
                                            key={game.id}
                                            className="bg-[#202020]"
                                            onClick={() => {
                                                const new_game = AllGames.find(
                                                    (game_inner) =>
                                                        game_inner.id ===
                                                        game.id,
                                                );
                                                setUserGames([
                                                    ...userGames,
                                                    { game_id: new_game!.id },
                                                ]);
                                            }}
                                        >
                                            {game.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="lg:w-3/4 w-full p-4 bg-[#141414]/40 text-[#e0e0e0]/90">
                        {selectedGame ? (
                            <>
                                <h2 className="mb-4 text-gray-100/90">
                                    {selectedGameName}
                                </h2>

                                <Attributes
                                    title="Important Information"
                                    readonly={true}
                                    key_placeholder=""
                                    value_placeholder="Enter Data"
                                    parentAttributes={Information}
                                    parentSetAttributes={setInformation}
                                />

                                <Attributes
                                    title="Additional Information"
                                    key_placeholder="Enter name of attribute e.g., Rank, Rold etc"
                                    value_placeholder="Enter value of attribute e.g., Iron 3, Bronze 1 etc"
                                    parentAttributes={AdditionalInformation}
                                    parentSetAttributes={
                                        setAdditionalInformation
                                    }
                                />

                                <Attributes
                                    title="Links (For Verification)"
                                    key_placeholder="Enter name of link e.g., Tracker, Facebook etc"
                                    value_placeholder="Enter link e.g., https://tracker.gg/user/123"
                                    parentAttributes={Links}
                                    parentSetAttributes={setLinks}
                                />

                                <Attributes
                                    title="Wins"
                                    key_input_type="date"
                                    key_placeholder="Enter date"
                                    value_placeholder="Enter value"
                                    parentAttributes={Wins}
                                    parentSetAttributes={setWins}
                                />

                                <Attributes
                                    title="Loss"
                                    key_input_type="date"
                                    key_placeholder="Enter date"
                                    value_placeholder="Enter value"
                                    parentAttributes={Loss}
                                    parentSetAttributes={setLoss}
                                />

                                <PrimaryBtn
                                    text="Save"
                                    active={false}
                                    className="w-full bg-[#222]/80 hover:bg-[#333]"
                                    onClick={handleGameSave}
                                />
                            </>
                        ) : (
                            <h3 className="text-center text-gray-300/80">
                                No game selected
                            </h3>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
