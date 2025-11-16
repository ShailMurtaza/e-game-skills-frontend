import { GameAttr } from "@/lib/Game";
import Input from "./Input";
import Button from "./Buttons";

function removeByIndex(arr: GameAttr[], idx: number) {
    return arr.filter((_, i) => i !== idx);
}

export function GameAttributes({
    label,
    gameId,
    parentAttributes,
    parentSetAttributes,
}: {
    label: string;
    gameId?: number;
    key_input_type?: string;
    placeholder: string;
    parentAttributes: GameAttr[];
    parentSetAttributes: (data: any) => void;
}) {
    return (
        <div className="mb-5">
            <h4 className="mb-3">{label}</h4>
            <div className="flex flex-col gap-3">
                {parentAttributes.map((attr, i) => {
                    if (attr.action !== "delete")
                        return (
                            <div
                                key={i}
                                className="flex flex-row gap-2 items-center"
                            >
                                <Input
                                    label=""
                                    name="attribute"
                                    type="text"
                                    value={attr.name}
                                    placeholder="Enter Attribute Name e.g., Rank, WinRate etc"
                                    onChange={(value: string) => {
                                        let newAttributes =
                                            parentAttributes.map(
                                                (game_attr, idx) =>
                                                    idx === i
                                                        ? {
                                                              ...attr,
                                                              name: value,
                                                          }
                                                        : game_attr,
                                            );
                                        parentSetAttributes(newAttributes);
                                    }}
                                />
                                <Button
                                    label="Delete"
                                    variant="danger"
                                    onClick={() => {
                                        if (
                                            parentAttributes[i].action ===
                                            "create"
                                        ) {
                                            const newAttributes = removeByIndex(
                                                parentAttributes,
                                                i,
                                            );
                                            parentSetAttributes(newAttributes);
                                        } else if (
                                            parentAttributes[i].action ===
                                            "update"
                                        ) {
                                            const newAttributes =
                                                parentAttributes.map(
                                                    (game_attr, idx) =>
                                                        idx === i
                                                            ? {
                                                                  ...game_attr,
                                                                  action: "delete",
                                                              }
                                                            : game_attr,
                                                );
                                            parentSetAttributes(newAttributes);
                                        }
                                    }}
                                />
                            </div>
                        );
                })}
                <Button
                    label="Add"
                    variant="primary"
                    onClick={() => {
                        parentSetAttributes([
                            ...parentAttributes,
                            {
                                name: "",
                                game_id: gameId,
                                action: "create",
                            },
                        ]);
                    }}
                />
            </div>
        </div>
    );
}
