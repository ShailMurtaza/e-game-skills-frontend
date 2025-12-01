"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaDiscord } from "react-icons/fa";

export function InputAuth({
    name,
    type,
    label,
    value = "",
    placeholder = "",
    disabled = false,
    onChange,
}: {
    name: string;
    type: string;
    label: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
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
                    disabled={disabled}
                    placeholder={placeholder}
                    required
                    className="mt-2 block w-full rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3 disabled:cursor-not-allowed disabled:opacity-40"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 text-gray-400 hover:text-gray-200"
                        tabIndex={-1}
                    >
                        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
    type = "submit",
    onClick,
}: {
    text: string;
    type?: "submit" | "button" | "reset" | undefined;
    onClick?: () => void;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
        >
            {text}
        </button>
    );
}

import { ButtonHTMLAttributes } from "react";

interface LoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    provider: "Google" | "Discord";
    onClick?: () => void;
}

export function LoginButton({ provider, onClick }: LoginButtonProps) {
    const icons = {
        Google: <FaGoogle className="w-10" />,
        Discord: <FaDiscord className="w-10" />,
    };

    return (
        <button
            type="button"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 font-medium border border-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            onClick={onClick}
        >
            {icons[provider]}
            {provider}
        </button>
    );
}
