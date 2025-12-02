import Link from "next/link";
const services = [
    {
        title: "Contact Us",
        description:
            "Reach out easily through our integrated contact system. We ensure every inquiry is delivered directly to the right department for quick and reliable support.",
        link: "/contactus",
    },
    {
        title: "Different Types of Users",
        description:
            "The system supports Admins, Players, and Teams. Teams can search for players and contact them directly, while players can build detailed profiles showcasing their skills and stats.",
        link: "/auth?signup",
    },
    {
        title: "Player / Team Profile Editor",
        description:
            "Players and teams can customize their profiles with data, achievements, and visuals. A simple editor makes it easy to keep your information up to date.",
        link: "/auth?signin",
    },
    {
        title: "Profile Search",
        description:
            "Find the right player or team fast using our search engine. Filter by skill, experience, or stats to connect with the best match.",
        link: "/search",
    },
    {
        title: "Admin Panel",
        description:
            "Admins can manage users, oversee activity, and ensure smooth operation. Powerful moderation and analytics tools provide full system control.",
        link: "/admin_panel",
    },
    {
        title: "Real-Time Text Messages",
        description:
            "Instant communication between users through our real-time messaging system. Designed for low latency and reliability.",
        link: "/messages",
    },
    {
        title: "AI Text Moderation Tool",
        description:
            "Messages are filtered by an AI-powered moderation engine to maintain respectful communication. Offensive or spam content is automatically detected and flagged.",
        link: "#",
    },
];

export default function ServicesPage() {
    return (
        <div className="pt-[150px] mx-3 min-h-screen bg-black text-red-700">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-normal text-blue-900 mb-4 text-left underline">
                    Our Services
                </h1>

                <div className="grid md:grid-cols-2 gap-3 select-text">
                    {services.map((service, index) => (
                        <Link
                            href={service.link}
                            key={index}
                            className="bg-green-300 p-3 rounded-sm transition-none cursor-default border-2 border-purple-700 hover:bg-pink-200"
                        >
                            <h2 className="text-xl font-light text-black mb-1 tracking-widest">
                                {service.title}
                            </h2>

                            <p className="text-gray-900 text-xs leading-snug italic">
                                {service.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
