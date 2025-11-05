import { WhisperRecord } from '../lib/types';
import WhisperCard from './WhisperCard';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface WhisperWallProps {
  whispers: WhisperRecord[];
  onReaction: () => void;
}

export default function WhisperWall({ whispers, onReaction }: WhisperWallProps) {
  if (!whispers || whispers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
          <Sparkles className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-lg opacity-60">
          No whispers yet — be the first to share kindness.
        </p>
        <p className="text-sm opacity-40 mt-2">
          Your gratitude will inspire others 🌸
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl opacity-90">Wall of Whispers</h2>
        <span className="text-sm opacity-50">({whispers.length})</span>
      </div>

      <div className="space-y-4">
        {whispers
          .slice()
          .reverse()
          .map((whisper, i) => (
            <WhisperCard
              key={whispers.length - 1 - i}
              record={whisper}
              index={whispers.length - 1 - i}
              onReaction={onReaction}
            />
          ))}
      </div>
    </div>
  );
}
