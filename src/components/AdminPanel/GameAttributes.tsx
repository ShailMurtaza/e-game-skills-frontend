import { GameAttr } from "@/lib/Game";
import Select from "./Select";
import Input from "./Input";
import Button from "./Buttons";

export function GameAttributes({
    label,
    parentAttributes,
    parentSetAttributes,
}: {
    label: string;
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
                    const key = Object.keys(attr)[0];
                    const value = Object.values(attr)[0];
                    return (
                        <div
                            key={i}
                            className="flex flex-row gap-2 items-center"
                        >
                            <Input
                                label=""
                                name="attribute"
                                type="text"
                                value={key}
                                placeholder="Enter Attribute Name e.g., Rank, WinRate etc"
                                onChange={(newKey: string) => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes[i] = {
                                        [newKey]: value,
                                    };
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                            <Select
                                value={value}
                                options={[
                                    { value: "text", label: "Text" },
                                    { value: "number", label: "Number" },
                                    { value: "date", label: "Date" },
                                ]}
                                onChange={(newValue: string) => {
                                    console.log(newValue);
                                }}
                            />
                            <Button
                                label="X"
                                variant="danger"
                                onClick={() => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes.splice(i, 1);
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                        </div>
                    );
                })}
                <Button
                    label="Add"
                    variant="primary"
                    onClick={() => {
                        parentSetAttributes([...parentAttributes, { "": "" }]);
                    }}
                />
            </div>
        </div>
    );
}
