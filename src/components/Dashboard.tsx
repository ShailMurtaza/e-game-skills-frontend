import { AttributesType } from "@/lib/Attributes";
import { MdDeleteOutline } from "react-icons/md";

export function PrimaryBtn({
    text,
    active = false,
    className = "",
    onClick,
}: {
    text: string;
    active?: boolean;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            className={`p-3 font-semibold rounded-md cursor-pointer border border-emerald-700 text-white shadow hover:bg-emerald-700 transition ${className} ${active ? "bg-emerald-700" : "bg-transparent"}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export function DangerBtn({
    children,
    className = "",
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex justify-center items-center lg:w-fit w-full text-center px-4 py-2 font-semibold rounded-md cursor-pointer bg-red-600 text-white shadow hover:bg-red-700 transition ${className}`}
        >
            {children}
        </button>
    );
}

export function Input({
    name,
    disabled = false,
    type,
    value = "",
    placeholder,
    className = "",
    onChange,
}: {
    name: string;
    disabled?: boolean;
    type: string;
    value?: string;
    placeholder: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            name={name}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className={`block rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-white-500 focus:border-indigo-500 focus:outline-none p-3 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
        />
    );
}

export function Attributes({
    title,
    readonly = false,
    key_input_type = "text",
    value_input_type = "text",
    key_placeholder,
    value_placeholder,
    parentAttributes,
    parentSetAttributes,
}: {
    title: string;
    readonly?: boolean;
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
                    return (
                        <div
                            key={i}
                            className="flex lg:flex-row flex-col lg:gap-10 gap-2 items-center"
                        >
                            <Input
                                name={`attr_${i}`}
                                disabled={readonly}
                                value={attr.name}
                                type={key_input_type}
                                placeholder={key_placeholder}
                                className="w-full"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes[i].name = e.target.value;
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                            <Input
                                name={`value_${i}`}
                                value={attr.value}
                                type={value_input_type}
                                placeholder={value_placeholder}
                                className="w-full"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    var newAttributes = [...parentAttributes];
                                    newAttributes[i].value = e.target.value;
                                    parentSetAttributes(newAttributes);
                                }}
                            />
                            {!readonly && (
                                <DangerBtn
                                    onClick={() => {
                                        var newAttributes = [
                                            ...parentAttributes,
                                        ];
                                        newAttributes.splice(i, 1);
                                        parentSetAttributes(newAttributes);
                                    }}
                                >
                                    <MdDeleteOutline size={20} />
                                </DangerBtn>
                            )}
                        </div>
                    );
                })}
                {!readonly && (
                    <button
                        onClick={() => {
                            parentSetAttributes([
                                ...parentAttributes,
                                { name: "", value: "" },
                            ]);
                        }}
                        className="w-fit p-3 font-semibold rounded-md cursor-pointer bg-emerald-700 text-white shadow hover:bg-emerald-500 transition"
                    >
                        Add
                    </button>
                )}
            </div>
        </div>
    );
}
