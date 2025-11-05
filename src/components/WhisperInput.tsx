import { useState } from 'react';
import { uploadToIPFS, encryptMessage } from '../lib/ipfs';
import { createZKProofForMembership } from '../lib/midnight';
import { ProofPackage } from '../lib/types';
import { Send, Loader2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface WhisperInputProps {
  onPost: (cid: string, proof: ProofPackage) => Promise<void>;
  connected: boolean;
}

export default function WhisperInput({ onPost, connected }: WhisperInputProps) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!connected) {
      setStatus('⚠️ Please connect your wallet first');
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    if (!text.trim()) return;

    setLoading(true);

    try {
      // Step 1: Client-side encryption
      setStatus('🔐 Encrypting your whisper...');
      await new Promise(resolve => setTimeout(resolve, 500));
      const encrypted = encryptMessage(text);

      // Step 2: Upload to IPFS
      setStatus('📦 Uploading to IPFS...');
      const cid = await uploadToIPFS(encrypted);

      // Step 3: Generate ZK proof
      setStatus('✨ Creating zero-knowledge proof...');
      const proofPackage = await createZKProofForMembership();

      // Step 4: Post to blockchain
      setStatus('⛓️ Posting to Midnight blockchain...');
      await onPost(cid, proofPackage);

      // Success
      setText('');
      setStatus('🌙 Whisper posted anonymously!');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('❌ Failed to post whisper');
      console.error(error);
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a gentle whisper of gratitude... 🌸"
          disabled={loading}
          className="w-full p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50 resize-none"
          maxLength={500}
        />
        <div className="absolute bottom-3 right-3 text-xs opacity-40">
          {text.length}/500
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {status ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span className="opacity-80">{status}</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 opacity-60">
              <Shield className="w-4 h-4" />
              <span>You remain anonymous — ZK proof verified</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim() || !connected}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Whisper</span>
        </button>
      </div>
    </motion.form>
  );
}
