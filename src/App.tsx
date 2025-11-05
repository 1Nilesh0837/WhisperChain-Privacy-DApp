import { useEffect, useState } from 'react';
import WhisperInput from './components/WhisperInput';
import WhisperWall from './components/WhisperWall';
import WalletConnect from './components/WalletConnect';
import BootingScreen from './components/BootingScreen';
import SignUpFlow from './components/SignUpFlow';
import { initMidnight, postWhisper, fetchWhispers } from './lib/midnight';
import { WhisperRecord, ProofPackage } from './lib/types';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

type AppState = 'booting' | 'signup' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('booting');
  const [whispers, setWhispers] = useState<WhisperRecord[]>([]);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Always show booting screen then signup
    setTimeout(() => {
      setAppState('signup');
    }, 3000); // 3 second boot screen
  }, []);

  async function initialize() {
    try {
      await initMidnight();
      await loadWhispers();
      setAppState('app');
    } catch (error) {
      console.error('Initialization failed:', error);
      setAppState('app'); // Show app anyway in demo mode
    }
  }

  async function loadWhispers() {
    const data = await fetchWhispers();
    setWhispers(data);
  }

  async function handlePost(cid: string, proof: ProofPackage) {
    await postWhisper(cid, proof);
    await loadWhispers();
  }

  function handleConnect(address: string) {
    setConnected(true);
    setWalletAddress(address);
  }

  function handleSignUpComplete(newUsername: string) {
    setUsername(newUsername);
    // Don't persist username - user will sign up each time
    initialize();
  }

  // Show booting screen
  if (appState === 'booting') {
    return <BootingScreen />;
  }

  // Show signup flow
  if (appState === 'signup') {
    return <SignUpFlow onComplete={handleSignUpComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900 text-slate-100">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-10 h-10 text-purple-300" />
          </div>
          
          <h1 className="text-5xl mb-3 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
            WhisperChain
          </h1>
          
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            A private gratitude ledger powered by zero-knowledge proofs
          </p>
          
          <p className="text-sm opacity-60 mt-2">
            Send kindness anonymously — verified, private, eternal 🌙
          </p>

          {/* User greeting */}
          {username && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 inline-block"
            >
              <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                <span className="text-sm opacity-80">Welcome back, </span>
                <span className="text-sm text-purple-300">{username}</span>
              </div>
            </motion.div>
          )}

          {/* Info badges */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              Midnight Blockchain
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              Zero-Knowledge Proofs
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
              IPFS Storage
            </span>
          </div>
        </motion.header>

        {/* Wallet Connection */}
        <WalletConnect onConnect={handleConnect} connected={connected} />

        {/* Whisper Input */}
        <WhisperInput onPost={handlePost} connected={connected} />

        {/* Whisper Wall */}
        <WhisperWall whispers={whispers} onReaction={loadWhispers} />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-xs opacity-40">
            Built for Midnight Privacy Mini DApps Hackathon
          </p>
          
          <p className="text-xs opacity-30 mt-2">
            Demo mode — using localStorage mocks for Midnight SDK & IPFS
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
