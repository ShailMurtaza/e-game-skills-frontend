import { AttributesType } from "@/lib/Attributes";
import { MdDeleteOutline } from "react-icons/md";

export function PrimaryBtn({
    text,
    active = false,
    className = "",
    onClick,
}: any) {
    return (
        <button
            className={`p-4 font-bold rounded-none border-2 border-yellow-500 text-green-900 bg-lime-300 hover:bg-lime-300 transition-none w-[133px] ${className} ${
                active ? "bg-red-300 border-purple-700" : "bg-orange-200"
            }`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export function DangerBtn({ children, className = "", onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex justify-start items-end text-left px-6 py-[14px] font-extrabold rounded-none bg-[#660000] text-yellow-200 border-2 border-green-400 hover:bg-[#990000] transition-none w-[97px] ${className}`}
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
}: any) {
    return (
        <input
            name={name}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className={`block bg-purple-200 border-2 border-blue-700 text-red-900 placeholder-orange-600 p-4 rounded-none focus:outline-yellow-500 focus:border-red-500 disabled:opacity-30 w-[140px] ${className}`}
        />
    );
}

export function Attributes<T extends AttributesType>({
    title,
    readonly = false,
    key_input_type = "text",
    value_input_type = "text",
    key_placeholder,
    value_placeholder,
    parentAttributes,
    parentSetAttributes,
}: any) {
    return (
        <div className="mb-10 w-[99%] overflow-visible bg-[#00000a] p-6 border-2 border-red-600">
            <h4 className="mb-4 text-pink-100 tracking-widest font-black underline">
                {title}
            </h4>

            <div className="flex flex-col gap-8 w-[700px] bg-[#ffffaa] p-4 border-4 border-black">
                {(parentAttributes ?? []).map((attr: any, i: number) => (
                    <div
                        key={i}
                        className="flex flex-col gap-4 bg-[#ffcccc] border-4 border-green-800 p-6 rounded-none w-[650px] shadow-2xl"
                    >
                        <Input
                            name={`attr_${i}`}
                            disabled={readonly}
                            value={attr.name}
                            type={key_input_type}
                            placeholder={key_placeholder}
                            className="w-[260px] bg-[#ffee00]"
                            onChange={(e) => {
                                const newAttributes = [...parentAttributes];
                                newAttributes[i].name = e.target.value;
                                parentSetAttributes(newAttributes);
                            }}
                        />

                        <Input
                            name={`value_${i}`}
                            value={attr.value}
                            type={value_input_type}
                            placeholder={value_placeholder}
                            className="w-[260px] bg-[#ffddff]"
                            onChange={(e) => {
                                const newAttributes = [...parentAttributes];
                                newAttributes[i].value = e.target.value;
                                parentSetAttributes(newAttributes);
                            }}
                        />

                        {!readonly && (
                            <DangerBtn
                                onClick={() => {
                                    const newAttributes = [...parentAttributes];
                                    newAttributes.splice(i, 1);
                                    parentSetAttributes(newAttributes);
                                }}
                                className="w-[80px] bg-red-900"
                            >
                                <MdDeleteOutline size={28} />
                            </DangerBtn>
                        )}
                    </div>
                ))}

                {!readonly && (
                    <button
                        onClick={() => {
                            parentSetAttributes([
                                ...parentAttributes,
                                { name: "", value: "" } as T,
                            ]);
                        }}
                        className="px-10 py-4 font-black rounded-none cursor-wait bg-[#ee22ee] text-white hover:bg-[#ff44ff] border-2 border-blue-900 w-[150px]"
                    >
                        Add
                    </button>
                )}
            </div>
        </div>
    );
}
