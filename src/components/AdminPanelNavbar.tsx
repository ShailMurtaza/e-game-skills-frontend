"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function AdminPanelNavbar() {
    const pathname = usePathname();
    const navItems = [
        { href: "/admin_panel", label: "Summary" },
        { href: "/admin_panel/users", label: "Users" },
        { href: "/admin_panel/games", label: "Games" },
        { href: "/admin_panel/reports", label: "Reports" },
        { href: "/admin_panel/ai_reports", label: "AI Reports" },
    ];
    return (
        <nav className="flex gap-2 bg-gray-900/40 p-2 rounded-md">
            {navItems.map((item, i) => {
                const active = pathname == item.href;
                return (
                    <Link href={item.href} key={i}>
                        <button
                            className={`px-3 py-2 rounded text-sm ${active ? "bg-gray-800" : "hover:bg-gray-800"}`}
                        >
                            {item.label}
                        </button>
                    </Link>
                );
            })}
        </nav>
    );
}
