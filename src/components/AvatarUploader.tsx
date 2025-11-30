// app/components/AvatarUploader.tsx
"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaCamera as Camera } from "react-icons/fa";

interface AvatarUploaderProps {
    currentAvatar: string;
    onFileSelect: (file: File | null) => void;
}

export default function AvatarUploader({
    onFileSelect,
    currentAvatar,
}: AvatarUploaderProps) {
    const [preview, setPreview] = useState<string>(currentAvatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = () => fileInputRef.current?.click();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        },
        [onFileSelect],
    );

    const { getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
        maxFiles: 1,
    });

    // Cleanup object URL on unmount or new selection
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div className="relative inline-block">
            <div className="group relative w-30 h-30">
                {preview ? (
                    <Image
                        src={preview}
                        alt="Avatar preview"
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                        fill
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                        <span className="text-4xl text-gray-500">?</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={openFilePicker}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change avatar"
                >
                    <Camera className="w-8 h-8 text-white" />
                </button>
            </div>

            <input
                {...getInputProps()}
                ref={fileInputRef}
                className="hidden"
                aria-hidden
            />
        </div>
    );
}
