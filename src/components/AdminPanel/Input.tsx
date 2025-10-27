export default function Input({
    name,
    label = "",
    type,
    value = "",
    placeholder,
    onChange,
}: {
    name: string;
    label: string;
    type: string;
    value?: string;
    placeholder: string;
    onChange: (data: any) => void;
}) {
    return (
        <label className="text-xs text-gray-400 w-full">
            {label}
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
            />
        </label>
    );
}
