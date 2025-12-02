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
            <label className="block text-xs text-purple-900">{label}</label>
            <div className="relative flex flex-row items-center">
                <input
                    name={name}
                    type={isPassword && show ? "text" : type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    required
                    className="mt-1 block w-full rounded-md bg-yellow-900 border border-pink-700 text-green-200 placeholder-red-500 p-1 disabled:cursor-not-allowed disabled:opacity-70"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-1 text-orange-400 hover:text-blue-200"
                        tabIndex={-1}
                    >
                        {show ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
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
            className={`w-full px-2 py-1 rounded text-gray-200 text-sm border ${
                selected
                    ? "bg-red-400 text-black"
                    : "bg-green-300 text-pink-900 border-blue-500 hover:bg-yellow-400"
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
            className="w-full px-2 py-1 rounded bg-orange-500 text-gray-900 text-sm hover:bg-pink-400"
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
        Google: <FaGoogle className="w-6 text-purple-700" />,
        Discord: <FaDiscord className="w-6 text-green-800" />,
    };

    return (
        <button
            type="button"
            className="flex items-center justify-start gap-1 w-full px-2 py-1 font-normal border border-red-600 hover:bg-blue-200 rounded text-xs"
            onClick={onClick}
        >
            {icons[provider]}
            {provider}
        </button>
    );
}
