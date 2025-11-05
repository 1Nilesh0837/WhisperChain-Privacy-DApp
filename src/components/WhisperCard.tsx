import { useState } from 'react';
import { WhisperRecord, ReactionType } from '../lib/types';
import { addReaction } from '../lib/midnight';
import { Shield, Heart, Moon, Flower } from 'lucide-react';
import { motion } from 'motion/react';

interface WhisperCardProps {
  record: WhisperRecord;
  index: number;
  onReaction: () => void;
}

export default function WhisperCard({ record, index, onReaction }: WhisperCardProps) {
  const [reacting, setReacting] = useState(false);

  async function handleReaction(type: ReactionType) {
    if (reacting) return;
    setReacting(true);
    
    try {
      await addReaction(index, type);
      onReaction();
    } catch (error) {
      console.error('Reaction failed:', error);
    } finally {
      setReacting(false);
    }
  }

  const reactions = record.reactions || { heart: 0, moon: 0, flower: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-5 mb-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20">
            <Moon className="w-4 h-4 text-purple-300" />
          </div>
          <span className="text-sm opacity-90">Anonymous (verified)</span>
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xs opacity-50">
          {formatTimestamp(record.timestamp)}
        </div>
      </div>

      {/* Message */}
      <div className="mb-4 pl-1">
        <p className="text-lg leading-relaxed italic opacity-95">
          {record.preview || '— encrypted message —'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {/* Reactions */}
        <div className="flex items-center gap-2">
          <ReactionButton
            icon={Heart}
            count={reactions.heart}
            onClick={() => handleReaction('heart')}
            disabled={reacting}
            color="text-pink-400"
          />
          <ReactionButton
            icon={Moon}
            count={reactions.moon}
            onClick={() => handleReaction('moon')}
            disabled={reacting}
            color="text-indigo-400"
          />
          <ReactionButton
            icon={Flower}
            count={reactions.flower}
            onClick={() => handleReaction('flower')}
            disabled={reacting}
            color="text-purple-400"
          />
        </div>

        {/* Proof info */}
        <div className="text-xs opacity-40 font-mono">
          Proof: {record.proof_root.slice(0, 8)}…
        </div>
      </div>
    </motion.div>
  );
}

interface ReactionButtonProps {
  icon: React.ElementType;
  count: number;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

function ReactionButton({ icon: Icon, count, onClick, disabled, color }: ReactionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
      <span className="text-sm opacity-70">{count}</span>
    </button>
  );
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
