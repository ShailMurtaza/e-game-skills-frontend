"use client";
import { useState } from "react";

const faqs = [
    {
        question: "What is E Game Skills?",
        answer: "E Game Skills is an online platform that connects e-sports teams with skilled players based on their in-game performance, rank, and playstyle. It provides a structured way to recruit and discover talent in the competitive gaming world.",
    },
    {
        question: "Who can use this platform?",
        answer: `The platform is designed for:
                <ul class="list-disc mx-10">
            <li>Players who want to showcase their gaming skills and get recognized.</li>
        <li>E-sports teams or organizations looking to find new, talented members that match their team’s requirements.</li>

        </ul>`,
    },
    {
        question: "Is E Game Skills free to use?",
        answer: "Yes, the platform is free for both players and teams in its initial phase. Future updates may introduce premium features for advanced analytics, verified profiles, or recruitment assistance.",
    },
    {
        question: "What games are supported?",
        answer: "Our platform is open to any competitive game. You can mention any game in your profile and display its statistics.",
    },
    {
        question: "How can I create a player or team profile?",
        answer: `
You can sign up on the platform using the Sign Up option in the navigation bar.
During registering, select whether you are a player or a team, and complete your profile with relevant details such as:
<ul class="list-disc mx-10">
<li>Rank or MMR</li>
<li>Preferred roles or agents/heroes</li>
<li>Playstyle description</li>
<li>Team experience (if any)</li>
</ul>
        `,
    },
    {
        question: "Who developed this platform?",
        answer: "E Game Skills is developed by a group of computer science students and passionate gamers as part of our final year university project. Our team combines experience in programming, cybersecurity, and competitive gaming to create an impactful solution for the e-sports community.",
    },
    {
        question: "How can I contact the developers?",
        answer: "You can visit our Contact Us page or reach out through the provided email and social links. We welcome feedback, suggestions, and collaboration ideas.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="mx-auto py-6 px-20 mt-10">
            <h2 className="text-3xl font-bold text-center mb-8">
                Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg shadow-sm bg-white/10 backdrop-blur-sm"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left p-4 font-semibold flex justify-between items-center hover:bg-white/10 rounded-t-lg"
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: faq.question,
                                }}
                            />
                            <span className="text-xl">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>
                        <div
                            className={`transition-all duration-200 ease-in-out ${
                                openIndex === index
                                    ? "opacity-100 p-4 border-t border-gray-700 bg-black/40"
                                    : "max-h-0 opacity-0 p-0"
                            }`}
                        >
                            <p
                                className="text-gray-200"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
