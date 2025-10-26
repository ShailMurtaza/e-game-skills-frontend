import { UsersDataProvider } from "@/components/UsersData";

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div className="p-3 bg-gray-850 rounded flex flex-col">
            <div className="text-xs text-gray-400">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="admin-page pt-[150px] mx-10 min-h-screen flex flex-col p-6 bg-black">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400">Summary</p>
                </div>
                <nav className="flex gap-2 bg-gray-900/40 p-2 rounded-md">
                    <button className="px-3 py-2 rounded text-sm hover:bg-gray-800">
                        Summary
                    </button>
                    <button className="px-3 py-2 rounded text-sm hover:bg-gray-800">
                        Users
                    </button>
                    <button className="px-3 py-2 rounded text-sm hover:bg-gray-800">
                        Games
                    </button>
                    <button className="px-3 py-2 rounded text-sm hover:bg-gray-800">
                        Reports
                    </button>
                    <button className="px-3 py-2 rounded text-sm hover:bg-gray-800">
                        AI Reports
                    </button>
                </nav>
            </header>
            <section className="grid grid-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1 bg-gray-900/40 p-4 rounded-lg border border-gray-800">
                    <h4>Summary</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <Stat title="Total" value={10} />
                        <Stat title="Admins" value={20} />
                        <Stat title="Teams" value={30} />
                        <Stat title="Players" value={40} />
                        <Stat title="Banned" value={50} />
                    </div>
                </aside>
                <div className="lg:col-span-3 p-4 bg-gray-900/40 rounded-lg border border-gray-800">
                    <UsersDataProvider>{children}</UsersDataProvider>
                </div>
            </section>
        </main>
    );
}
