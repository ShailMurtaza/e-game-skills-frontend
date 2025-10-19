"use client";
import { motion } from "framer-motion";
import { Orbitron } from "next/font/google";
import FAQ from "@/components/FAQ";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700"] });

export default function Home() {
    return (
        <main className={orbitron.className}>
            <section
                className="flex flex-row items-center justify-center relative bg-center bg-cover bg-no-repeat h-screen"
                style={{ backgroundImage: "url('/radiant_dire.jpg')" }}
            >
                <motion.h1
                    className="text-5xl font-bold absolute bottom-1/12 z-0"
                    initial={{ opacity: 0, y: 150 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Let's dive into the world of eSports
                </motion.h1>
            </section>
            <section
                className="flex flex-row justify-center mt-10 bg-center relative bg-cover bg-no-repeat h-screen"
                style={{ backgroundImage: "url('/stadium.jpg')" }}
            >
                <motion.h1
                    className="text-5xl font-bold absolute bottom-1/12 z-0"
                    initial={{ opacity: 0, y: 150 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Pursue Your Dream To Become An eSports Champoin
                </motion.h1>
            </section>
            <section className="mt-10">
                <FAQ />
            </section>
        </main>
    );
}
