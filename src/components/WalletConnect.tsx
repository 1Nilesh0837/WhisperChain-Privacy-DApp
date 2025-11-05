import { useState } from 'react';
import { connectWallet } from '../lib/midnight';
import { Wallet, Check } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  connected: boolean;
}

export default function WalletConnect({ onConnect, connected }: WalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      onConnect(addr);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Wallet className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <div className="text-sm opacity-70">Midnight Wallet</div>
          {connected ? (
            <div className="flex items-center gap-2">
              <div className="text-sm font-mono">{address.slice(0, 12)}...{address.slice(-6)}</div>
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="text-sm opacity-50">Not connected</div>
          )}
        </div>
      </div>
      
      {!connected && (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </div>
  );
}
