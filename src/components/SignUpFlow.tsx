import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Users, Heart, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SignUpFlowProps {
  onComplete: (username: string) => void;
}

export default function SignUpFlow({ onComplete }: SignUpFlowProps) {
  const [step, setStep] = useState<'welcome' | 'create' | 'verify'>('welcome');
  const [username, setUsername] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function handleContinue() {
    if (step === 'welcome') {
      setStep('create');
    } else if (step === 'create' && username.trim()) {
      setStep('verify');
      // Simulate verification delay
      setTimeout(() => {
        onComplete(username);
      }, 2000);
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
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

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 max-w-2xl w-full"
          >
            <div className="text-center">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-12 h-12 text-purple-300" />
              </motion.div>

              {/* Welcome text */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent"
              >
                Welcome to WhisperChain
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl opacity-80 mb-12 max-w-xl mx-auto leading-relaxed"
              >
                A safe space to share gratitude anonymously.
                Every whisper is verified, private, and eternal.
              </motion.p>

              {/* Features grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: Shield,
                    title: 'Private & Anonymous',
                    description: 'Zero-knowledge proofs protect your identity'
                  },
                  {
                    icon: Users,
                    title: 'Verified Community',
                    description: 'Only genuine members can whisper'
                  },
                  {
                    icon: Heart,
                    title: 'Spread Kindness',
                    description: 'Share gratitude without fear'
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <feature.icon className="w-8 h-8 text-purple-300 mx-auto mb-4" />
                    <h3 className="mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-60">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-xs opacity-40"
              >
                By continuing, you agree to our privacy-first approach.
                No personal data is collected or stored on-chain.
              </motion.p>
            </div>
          </motion.div>
        )}

        {step === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 max-w-md w-full"
          >
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-purple-500/20 mb-4">
                  <Sparkles className="w-8 h-8 text-purple-300" />
                </div>
                <h2 className="text-3xl mb-2">Create Your Identity</h2>
                <p className="opacity-60">Choose a display name for your whispers</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm opacity-70 mb-2">Display Name</label>
                  <Input
                    type="text"
                    placeholder="Anonymous Whisperer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-purple-500"
                    maxLength={30}
                  />
                  <p className="text-xs opacity-40 mt-2">
                    This name is only visible to you. All whispers remain anonymous.
                  </p>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm opacity-70">
                    I understand that WhisperChain uses zero-knowledge proofs to ensure
                    privacy and that no personal information is stored on-chain.
                  </label>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleContinue}
                  disabled={!username.trim() || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Privacy note */}
              <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs opacity-70">
                  🔐 <strong>Privacy First:</strong> Your display name is stored locally
                  and never shared. All whispers are cryptographically anonymous.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="relative z-10 max-w-md w-full text-center"
          >
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/30 mb-8 relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <Check className="w-16 h-16 text-emerald-400" />
              </motion.div>

              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl mb-3">Welcome, {username}!</h2>
              <p className="text-lg opacity-70 mb-8">
                Setting up your anonymous identity...
              </p>

              {/* Progress steps */}
              <div className="space-y-3 text-left max-w-xs mx-auto">
                {[
                  'Generating cryptographic keys',
                  'Creating ZK proof credentials',
                  'Connecting to Midnight network',
                  'Ready to whisper kindness'
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.3 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.3 }}
                      className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                    </motion.div>
                    <span className="opacity-70">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
