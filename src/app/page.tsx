"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className="relative bg-[#050505]">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-walking-in-a-dark-tunnel-2626/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="font-mono text-xs md:text-sm uppercase tracking-widest text-[#EDEDED] mb-4"
          >
            COLLECTION 001
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="text-[#EDEDED] text-5xl md:text-7xl lg:text-9xl font-bold leading-none"
          >
            COMING SOON
          </motion.h1>
        </div>
      </section>

      {/* Infinite Marquee */}
      <section className="relative border-y border-[#EDEDED]/10 py-4 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          <div className="flex items-center gap-8">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="font-mono text-xs md:text-sm text-[#EDEDED] uppercase tracking-wider"
              >
                VEH ARCHIVE — SILENCE OVER NOISE — YEREVAN —
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* The Lookbook */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#EDEDED] mb-12 text-center">
            THE LOOKBOOK
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                className="relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="aspect-[3/4] bg-gray-800 grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="font-mono text-xs text-gray-500 uppercase">
                      Image {index + 1}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter Footer */}
      <section className="border-t border-[#EDEDED]/10 py-16 md:py-20 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <form className="relative">
            <input
              type="email"
              placeholder="enter email for access"
              className="w-full bg-transparent border-0 border-b border-[#EDEDED]/20 pb-3 text-[#EDEDED] placeholder:text-gray-500 focus:outline-none focus:border-[#EDEDED]/40 transition-colors font-mono text-sm uppercase tracking-wider"
            />
            <motion.button
              type="submit"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 text-[#EDEDED] font-mono text-sm"
              aria-label="Submit"
            >
              →
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
