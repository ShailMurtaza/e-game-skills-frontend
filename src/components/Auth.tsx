"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function InputAuth({
    name,
    type,
    label,
    value = "",
    onChange,
}: {
    name: string;
    type: string;
    label: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>
            <div className="relative flex flex-row items-center">
                <input
                    name={name}
                    type={isPassword && show ? "text" : type}
                    value={value}
                    onChange={onChange}
                    required
                    className="mt-2 block w-full rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 text-gray-400 hover:text-gray-200"
                        tabIndex={-1}
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export function SelectButton({
    label,
    selected,
    onClick,
}: {
    label: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full px-4 py-3 rounded-lg text-white font-semibold transition border-1 border-solid border-indigo-600 ${
                selected
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-gray-700 border-gray-300 hover:bg-indigo-500"
            }`}
        >
            {label}
        </button>
    );
}

export function SubmitBtn({
    text,
    onClick,
}: {
    text: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
        >
            {text}
        </button>
    );
}
