import { motion } from "framer-motion";

export default function Logo () {
    return (
        <>
        <div className="overflow-hidden">
          <motion.h1
            className="text-3xl font-black tracking-tighter"
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
        </>
    )
}