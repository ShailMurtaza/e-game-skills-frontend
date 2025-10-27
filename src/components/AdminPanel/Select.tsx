type SelectOptionsType = Array<{ value: string; label: string }>;

export default function Select({
    label = "",
    value = "",
    options,
    onChange,
}: {
    label?: string;
    value?: string;
    options: SelectOptionsType;
    onChange: (data: any) => void;
}) {
    return (
        <label className="text-xs text-gray-400">
            {label}
            <select
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                className="w-full mt-1 bg-gray-800 px-2 py-2 rounded text-sm outline-none"
            >
                {options.map((opt, i) => {
                    return (
                        <option key={i} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}
