function Profile() {
    return (
        <div className="mb-5 bg-zinc-900 p-6 rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer">
            <div className="flex flex-row items-center gap-5">
                <img src="/profile.png" width="50px" />
                <span>Username</span>
            </div>
        </div>
    );
}

function Message() {
    return (
        <div className="flex-1 p-4 space-y-6">
            <div className="text-center text-gray-400 text-sm">Today</div>

            <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-2xl max-w-fit">
                    <p>Hello, how are you?</p>
                    <span className="block text-xs text-gray-400 text-right mt-1">
                        10:12 AM
                    </span>
                </div>
            </div>

            <div className="flex justify-end">
                <div className="bg-blue-600 px-4 py-2 rounded-2xl max-w-fit">
                    <p>Doing great, thanks!</p>
                    <span className="block text-xs text-gray-300 text-right mt-1">
                        10:13 AM
                    </span>
                </div>
            </div>
        </div>
    );
}
export default function Messages() {
    return (
        <main className="pt-[150px]">
            <h1 className="text-center mb-5">Messages</h1>

            <div className="mx-5 flex flex-row gap-5 rounded-xl h-[calc(100vh-300px)]">
                <section className="p-5 w-1/4 overflow-y-auto">
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                    <Profile />
                </section>

                <section className="relative w-3/4 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <div className="absolute top-0 w-full text-lg font-semibold bg-zinc-900 p-4">
                        <div className="flex flex-row items-center gap-5">
                            <img src="/profile.png" width="50px" />
                            <span>Username</span>
                        </div>
                    </div>

                    <div className="absolute bottom-0 w-full bg-zinc-900 p-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-xl outline-none bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                        />
                        <button className="ml-3 transition-colors bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl">
                            Send
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-full pt-[75px] pb-[75px] px-5 space-y-6">
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                        <Message />
                    </div>
                </section>
            </div>
        </main>
    );
}
