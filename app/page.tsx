"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 px-6 text-zinc-100 selection:bg-accent selection:text-accent-foreground">
      {/* Subtle vignette effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Elegant grain texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Parallax ambient light with mouse tracking */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary glow that moves opposite direction */}
      <motion.div
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-150 w-150 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)",
          x: -mousePosition.x * 0.5,
          y: -mousePosition.y * 0.5,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Animated accent line - top */}
      <motion.div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Animated accent line - bottom */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/30 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Elegant corner accent - top left with draw animation */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div 
          className="h-20 w-px bg-linear-to-b from-accent/40 to-transparent"
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div 
          className="absolute left-0 top-0 h-px w-20 bg-linear-to-r from-accent/40 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Elegant corner accent - bottom right with draw animation */}
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div 
          className="absolute bottom-0 right-0 h-20 w-px bg-linear-to-t from-accent/40 to-transparent"
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 h-px w-20 bg-linear-to-l from-accent/40 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Elegant floating orbs with trails */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 20}%`,
              top: `${25 + i * 15}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          >
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)",
                filter: "blur(2px)",
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
            {/* Trail effect */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-20 w-px -translate-x-1/2 -translate-y-1/2 bg-linear-to-b from-accent/20 to-transparent"
              style={{
                filter: "blur(1px)",
              }}
              animate={{
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Staggered reveal letter by letter effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
        <motion.div className="text-[20vw] font-black tracking-tighter text-accent/10">
          {["D", "E", "X", "T", "R"].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 0.1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Badge at top with spacing */}
      <div className="relative z-10 flex justify-center pt-8">
        <motion.div
          className="group flex items-center gap-3 rounded-full border border-zinc-800/50 bg-zinc-900/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-accent backdrop-blur-md transition-all duration-500 hover:border-accent/40 hover:bg-zinc-900/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="relative flex h-2 w-2">
            <motion.span 
              className="absolute inline-flex h-full w-full rounded-full bg-accent"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          </span>
          Workspace 01
        </motion.div>
      </div>

      {/* Main content centered */}
      <main className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center text-center max-w-2xl">
        {/* Main heading with character animation */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-6xl font-black tracking-tighter sm:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.3, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {["D", "E"].map((letter, i) => (
              <motion.span
                key={`first-${i}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="inline-block text-accent"
              style={{
                filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.55,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {["X",].map((letter, i) => (
                <motion.span
                  key={`accent-${i}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    filter: [
                      "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
                      "drop-shadow(0 0 30px rgba(167, 139, 250, 0.5))",
                      "drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))",
                    ],
                  }}
                  transition={{
                    y: {
                      duration: 0.5,
                      delay: 0.55 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    filter: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
            {["T", "R"].map((letter, i) => (
              <motion.span
                key={`last-${i}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Description with word-by-word reveal */}
        <div className="mt-8 overflow-hidden">
          <motion.p
            className="text-xl leading-relaxed text-zinc-400 font-medium max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 1, 
              delay: 0.9, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {[
              "A high-fidelity personal UI workshop.",
              "Design, test, and refine production-grade interfaces",
              "in a vacuum before shipping."
            ].map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.split(" ").map((word, wordIndex) => (
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.9 + (lineIndex * 0.3) + (wordIndex * 0.03),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.p>
        </div>

        {/* Buttons with magnetic effect */}
        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.5, 
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/workshop/components"
              className="group relative flex items-center justify-center overflow-hidden rounded-full bg-accent px-8 py-4 text-sm font-black uppercase tracking-widest text-accent-foreground transition-all duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.4)]"
            >
              <motion.span 
                className="relative z-10 transition-transform duration-300"
                initial={{ x: 0 }}
              >
                Enter Workshop
              </motion.span>
              <ArrowRight className="size-3 group-hover:translate-x-2 transition-transform duration-300 text-transparent group-hover:text-white"/>
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/workbench"
              className="group block rounded-full border border-zinc-800/50 bg-zinc-900/20 px-8 py-4 text-sm font-black uppercase tracking-widest text-zinc-400 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600 hover:bg-zinc-900/40 hover:text-zinc-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            >
              <span className="transition-transform duration-300 inline-block group-hover:translate-x-0.5">
                Workbench
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer at bottom */}
      <motion.footer
        className="relative z-10 pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 1, 
          delay: 1.8, 
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700">
          Refine Often. Reuse without hesitation.
        </p>
      </motion.footer>
    </div>
  );
}