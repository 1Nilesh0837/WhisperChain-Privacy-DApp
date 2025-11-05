import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function BootingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden">
      {/* Background animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1
          }}
          className="relative mb-8"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px 10px rgba(168, 85, 247, 0.4)',
                '0 0 40px 20px rgba(168, 85, 247, 0.6)',
                '0 0 20px 10px rgba(168, 85, 247, 0.4)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Logo circle */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center"
            animate={{
              borderColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Sparkles icon with rotation */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Sparkles className="w-16 h-16 text-purple-200" />
            </motion.div>
          </motion.div>

          {/* Orbiting particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [
                  Math.cos((i * Math.PI) / 2) * 80,
                  Math.cos((i * Math.PI) / 2 + Math.PI * 2) * 80,
                ],
                y: [
                  Math.sin((i * Math.PI) / 2) * 80,
                  Math.sin((i * Math.PI) / 2 + Math.PI * 2) * 80,
                ],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
            WhisperChain
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg opacity-70"
          >
            Privacy-First Gratitude Ledger
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-col items-center"
        >
          {/* Loading bar */}
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2.5,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-sm opacity-50"
            animate={{
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Initializing zero-knowledge circuits...
          </motion.p>
        </motion.div>

        {/* Floating whisper messages effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs opacity-20"
              initial={{
                x: `${Math.random() * 100}%`,
                y: '120%',
              }}
              animate={{
                y: '-20%',
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
            >
              🌸
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
