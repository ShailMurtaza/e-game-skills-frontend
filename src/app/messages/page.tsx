function Profile() {
    return (
        <div className="flex flex-row items-center gap-5 p-5 border-b-1 border-white last:border-b-0 cursor-pointer hover:bg-gray-900 rounded-xl transition-all duration-100">
            <img src="/profile.png" width="50px" />
            <span>Username</span>
        </div>
    );
}

function Message() {
    return (
        <div className="flex-1 p-4 space-y-6">
            <div className="text-center text-gray-400 text-sm">Today</div>

            <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-2xl max-w-xs">
                    <p>Hello, how are you?</p>
                    <span className="block text-xs text-gray-400 text-right mt-1">
                        10:12 AM
                    </span>
                </div>
            </div>

            <div className="flex justify-end">
                <div className="bg-blue-600 px-4 py-2 rounded-2xl max-w-xs">
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

            <div className="mx-5 flex flex-row border-1 border-white rounded-xl h-[calc(100vh-300px)]">
                <section className="border-r-1 border-r-white w-1/4 overflow-y-auto">
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

                <section className="relative w-3/4 rounded-r-xl overflow-hidden">
                    <div className="absolute top-0 w-full border-b border-gray-700 text-lg font-semibold bg-gray-800 p-4">
                        Username
                    </div>

                    <div className="absolute bottom-0 w-full border-t border-gray-700 bg-gray-800 p-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-xl outline-none"
                        />
                        <button className="ml-3 bg-blue-600 px-4 py-2 rounded-xl">
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
