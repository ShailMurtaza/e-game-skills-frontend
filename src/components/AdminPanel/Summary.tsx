"use client";

import { useUsersData } from "@/context/UsersData";

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div className="p-3 bg-gray-850 rounded flex flex-col">
            <div className="text-xs text-gray-400">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}

export default function Summary() {
    const usersData = useUsersData();
    return (
        <aside className="h-fit lg:col-span-1 bg-gray-900/40 p-4 rounded-lg border border-gray-800">
            <h4>Summary</h4>
            <div className="grid grid-cols-2 gap-3">
                <Stat title="TOTAL" value={usersData?.total || 0} />
                {usersData &&
                    Object.keys(usersData.by_role).map((key: string) => {
                        return (
                            <Stat
                                key={key}
                                title={key.toUpperCase()}
                                value={usersData.by_role[key]}
                            />
                        );
                    })}
                <Stat title="BANNED" value={usersData?.banned || 0} />
            </div>
        </aside>
    );
}
