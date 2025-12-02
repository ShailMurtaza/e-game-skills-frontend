const styles = {
    neutral: "bg-gray-700 hover:bg-gray-800",
    primary: "bg-green-700 hover:bg-green-800",
    secondary: "bg-blue-700 hover:bg-blue-800",
    danger: "bg-red-700 hover:bg-red-800",
};

type ButtonVariant = "neutral" | "primary" | "secondary" | "danger";

export default function Button({
    label,
    variant = "neutral",
    className = "",
    onClick,
}: {
    label: string;
    variant: ButtonVariant;
    className?: string;
    onClick: () => void;
}) {
    return (
        <button
            className={`transition w-fit px-3 py-2 rounded text-sm ${className} `}
            onClick={onClick}
        >
            {label}
        </button>
    );
}
