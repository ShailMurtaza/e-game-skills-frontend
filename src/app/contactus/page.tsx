function InputField({
    name,
    type,
    placeholder,
    label,
}: {
    name: string;
    type: string;
    placeholder: string;
    label: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required
                className="mt-2 block w-full rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3"
            />
        </div>
    );
}

function SubmitBtn({ text }: { text: string }) {
    return (
        <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition"
        >
            {text}
        </button>
    );
}

export default function Auth() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-black text-gray-100">
            <div className="w-full max-w-fit bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_20px_2px_rgba(99,102,241,0.2)] overflow-x-hidden">
                <section className="flex flex-row gap-10 justify-center p-8 min-h-[520px]">
                    <form className="flex flex-col justify-between">
                        <h3 className="text-2xl font-bold text-gray-100">
                            Contact Us
                        </h3>
                        <div className="flex flex-row justify-center gap-5 my-5">
                            <InputField
                                name="email"
                                type="email"
                                placeholder="Enter you Email address"
                                label="Email"
                            />
                            <InputField
                                name="name"
                                type="text"
                                placeholder="Enter you name"
                                label="Name"
                            />
                        </div>
                        <div className="my-5">
                            <label className="block text-sm font-medium text-gray-300">
                                Message
                            </label>
                            <textarea
                                name="msg"
                                placeholder="Type your message"
                                className="w-full min-h-[200px] mt-2 block rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none p-3"
                            ></textarea>
                        </div>
                        <SubmitBtn text="Submit" />
                    </form>
                </section>
            </div>
        </main>
    );
}
