"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-[#050505] overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-[#EDEDED] text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold leading-none tracking-tight"
        >
          VEH
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
          className="text-[#EDEDED] text-sm md:text-base lg:text-lg font-light tracking-[0.3em] uppercase mt-8"
        >
          SILENCE OVER NOISE
        </motion.p>
      </div>
    </main>
  );
}
