import { AttributesType } from "@/lib/Attributes";

export function PrimaryBtn({
    text,
    active = false,
    onClick,
}: {
    text: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            className={`p-3 font-semibold rounded-md cursor-pointer border-1 border-emerald-700 text-white shadow hover:bg-emerald-700 transition ${active ? "bg-emerald-700" : "bg-transparent"}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export function Input({
    name,
    type,
    value,
    placeholder,
    onChange,
}: {
    name: string;
    type: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="block w-full rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-white-500 focus:border-indigo-500 focus:outline-none p-3"
        />
    );
}

export function Attributes({
    title,
    key_input_type = "text",
    value_input_type = "text",
    key_placeholder,
    value_placeholder,
    parentAttributes,
    parentSetAttributes,
}: {
    title: string;
    default_values?: AttributesType;
    key_input_type?: string;
    value_input_type?: string;
    key_placeholder: string;
    value_placeholder: string;
    parentAttributes: AttributesType;
    parentSetAttributes: (data: any) => void;
}) {
    return (
        <div className="mb-5">
            <h4 className="mb-3">{title}</h4>
            <div className="flex flex-col gap-5">
                {/* If parentAttributes is undefined then return empty array */}
                {(parentAttributes ?? []).map((attr, i) => {
                    const attribute = Object.keys(attr)[0];
                    const value = Object.values(attr)[0];
                    return (
                        <div
                            key={i}
                            className="flex flex-row gap-10 items-center"
                        >
                            <Input
                                name={`attr_${i}`}
                                value={attribute}
                                type={key_input_type}
                                placeholder={key_placeholder}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes[i] = {
                                        [e.target.value]: value,
                                    };
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                            <Input
                                name={`value_${i}`}
                                value={value}
                                type={value_input_type}
                                placeholder={value_placeholder}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes[i] = {
                                        [attribute]: e.target.value,
                                    };
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                            <button
                                onClick={() => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes.splice(i, 1);
                                    parentSetAttributes(newAttributes);
                                }}
                                className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-red-700 text-white shadow hover:bg-red-500 transition"
                            >
                                X
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={() => {
                        parentSetAttributes([...parentAttributes, { "": "" }]);
                    }}
                    className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-emerald-700 text-white shadow hover:bg-emerald-500 transition"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
