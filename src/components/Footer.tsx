"use client";
import { useEffect, useState } from "react";

export default function Footer() {
    const [year, setYear] = useState<number | null>(null);
    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <footer className="mt-5 p-5 text-center">
            &copy; {year} E Game Skills, all rights reserved.
        </footer>
    );
}
