"use client";
import { PrimaryBtn, Attributes, DangerBtn } from "@/components/Dashboard";
import { AttributesType } from "@/lib/Attributes";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useAuth } from "@/context/authContext";
import { useUI } from "@/context/UIContext";
import { useEffect, useState } from "react";
import { LoadingComponent } from "@/components/Loading";
import UpdateUserProfile from "@/components/UpdateUserProfile";
import { MdDeleteOutline } from "react-icons/md";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserDashboard() {
    const { setLoading, notify } = useUI();
    const [AllGames, setAllGames] = useState<any[]>([]);
    const [userGames, setUserGames] = useState<any[]>([]);
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
    const [Information, setInformation] = useState<any[]>([]);
    const [AdditionalInformation, setAdditionalInformation] =
        useState<AttributesType>([]);
    const [Links, setLinks] = useState<AttributesType>([]);
    const [Wins, setWins] = useState<AttributesType>([]);
    const [Loss, setLoss] = useState<AttributesType>([]);

    const { isLoading, isAuthenticated, userProfile } = useAuth();

    const [selectedGameName, setSelectedGameName] = useState("");
    useEffect(() => {
        const selected_game = AllGames.find((game) => game.id == selectedGame);
        if (selected_game) {
            setSelectedGameName(selected_game.name);
            const user_selected_game = userGames.find(
                (user_game) => user_game.game_id === selected_game.id,
            );
            var user_links: any[] = [];
            (user_selected_game.Links ?? []).map(
                (link: { name: string; value: string }) => {
                    user_links.push({ name: link.name, value: link.value });
                },
            );
            var custom_attributes: any[] = [];
            (user_selected_game.custom_attributes ?? []).map(
                (attr: { name: string; value: string }) => {
                    custom_attributes.push({
                        name: attr.name,
                        value: attr.value,
                    });
                },
            );
            // Separate Wins and Loss
            var wins: any[] = [];
            var loss: any[] = [];
            (user_selected_game.WinsLoss ?? []).map(
                (attr: {
                    value: number;
                    date: string;
                    type: "Win" | "Loss";
                }) => {
                    const date = new Date(attr.date)
                        .toISOString()
                        .split("T")[0];
                    if (attr.type == "Win")
                        wins.push({
                            name: date,
                            value: attr.value,
                        });
                    else
                        loss.push({
                            name: date,
                            value: attr.value,
                        });
                },
            );
            var gameAttributes: any[] = [];
            (selected_game.attributes ?? []).map((attr: any) => {
                var value = "";
                const attribute_value = (
                    user_selected_game.attribute_values ?? []
                ).find(
                    (attr_value: any) =>
                        attr_value.game_attribute_id === attr.id,
                );
                if (attribute_value) value = attribute_value.value;
                gameAttributes.push({
                    id: attr.id,
                    game_attribute_id: attr.id,
                    user_game_id: attr.game_id,
                    name: attr.name,
                    value: value,
                });
            });
            setLinks(user_links);
            setAdditionalInformation(custom_attributes);
            setWins(wins);
            setLoss(loss);
            setInformation(gameAttributes);
        }
    }, [selectedGame]);

    async function handleDeleteUserGame(game_id: any) {
        setLoading(true);
        if (selectedGame == game_id) setSelectedGame(null);
        // Check if this game doesn't exist in database by checking if 'id' exists of not
        if (
            !userGames
                .find((game) => game_id === game.game_id)
                .hasOwnProperty("id")
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
        } catch (e: any) {
            notify(e.message, "error");
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
                                value: win.value,
                                type: "Win",
                            };
                        }),
                        ...Loss.map((loss) => {
                            return {
                                date: loss.name,
                                value: loss.value,
                                type: "Loss",
                            };
                        }),
                    ],
                };
            } else {
                return game;
            }
        });
        setUserGames(newUserGames);
        // Send PUT request to save data
        var allData = {
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
        } catch (err: any) {
            notify(err.message, "error");
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
        <main className="pt-[150px] mx-5 lg:mx-10">
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
            <div className="border border-white rounded-2xl bg-neutral-950">
                <UpdateUserProfile />
                <section className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/4 p-5 border-b lg:border-r lg:border-b-0 border-white">
                        <h4 className="mb-5">Your Games</h4>
                        <div className="flex flex-col gap-5">
                            {userGames.map((g) => {
                                const game_id = g.game_id;
                                const game = AllGames.find(
                                    (game) => game_id == game.id,
                                );
                                if (game)
                                    return (
                                        <div
                                            key={game.id}
                                            className="flex flex-row w-full gap-3"
                                        >
                                            <PrimaryBtn
                                                text={game.name}
                                                active={
                                                    game.id === selectedGame
                                                }
                                                onClick={() => {
                                                    setSelectedGame(game.id);
                                                }}
                                                className="w-full"
                                            />
                                            <DangerBtn
                                                onClick={() => {
                                                    setUserGameDelete(game.id);
                                                }}
                                            >
                                                <MdDeleteOutline size={20} />
                                            </DangerBtn>
                                        </div>
                                    );
                            })}
                            <select className="p-3 font-semibold cursor-pointer rounded-md bg-black border border-emerald-700 text-white shadow hover:bg-emerald-700 transition">
                                <option>Add New Game</option>
                                {AllGames.filter((game) => {
                                    return !userGames.find((user_game) => {
                                        return game.id === user_game.game_id;
                                    });
                                }).map((game) => {
                                    return (
                                        <option
                                            key={game.id}
                                            onClick={() => {
                                                const new_game = AllGames.find(
                                                    (game_inner) =>
                                                        game_inner.id ===
                                                        game.id,
                                                );
                                                setUserGames([
                                                    ...userGames,
                                                    { game_id: new_game.id },
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
                    <div className="lg:w-3/4 w-full p-5">
                        {selectedGame ? (
                            <>
                                <h2 className="mb-5">{selectedGameName}</h2>
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
                                    className="w-full"
                                    onClick={handleGameSave}
                                />
                            </>
                        ) : (
                            <h3 className="text-center">No game selected</h3>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
