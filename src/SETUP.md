# WhisperChain Setup Guide

Complete instructions for running WhisperChain locally and deploying to production.

---

## 🚀 Quick Start (Demo Mode)

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Brave)

### Installation

```bash
# Clone the repository (or use this directory)
cd whisperchain

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:5173`

### Demo Features

In demo mode, WhisperChain uses:
- **localStorage** instead of Midnight blockchain
- **Mock ZK proofs** (no actual proof generation)
- **Base64 encoding** instead of real encryption
- **In-memory IPFS** (localStorage)

Perfect for testing UI/UX and hackathon demos!

---

## 🔧 Development Setup

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Environment Variables

Create a `.env.local` file:

```bash
# Midnight Network
VITE_MIDNIGHT_NETWORK=testnet
VITE_MIDNIGHT_RPC_URL=https://testnet-rpc.midnight.network

# IPFS Configuration
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_IPFS_API_URL=https://ipfs.infura.io:5001

# Contract Address (after deployment)
VITE_CONTRACT_ADDRESS=0x...

# Feature Flags
VITE_ENABLE_MOCK_MODE=true
```

### Project Structure

```
whisperchain/
├── App.tsx                    # Main app component
├── components/
│   ├── WalletConnect.tsx      # Wallet UI
│   ├── WhisperInput.tsx       # Message input
│   ├── WhisperCard.tsx        # Message card
│   └── WhisperWall.tsx        # Message feed
├── lib/
│   ├── types.ts               # TypeScript types
│   ├── midnight.ts            # Blockchain SDK
│   └── ipfs.ts                # IPFS helper
├── contracts/
│   └── whisper.compact        # Smart contract
├── styles/
│   └── globals.css            # Global styles
└── README.md
```

---

## 🌐 Production Setup

### 1. Install Midnight CLI

```bash
# Install via npm
npm install -g @midnight-network/cli

# Verify installation
midnight --version

# Initialize wallet
midnight wallet create
midnight wallet export > wallet.json
```

### 2. Configure IPFS

#### Option A: Use IPFS Service (Recommended)

```bash
# Sign up for Infura or Pinata
# Get API credentials

# Update .env.local
VITE_IPFS_API_URL=https://ipfs.infura.io:5001
VITE_IPFS_PROJECT_ID=your_project_id
VITE_IPFS_PROJECT_SECRET=your_secret
```

#### Option B: Run Local IPFS Node

```bash
# Install IPFS
brew install ipfs  # macOS
# or download from https://ipfs.tech

# Initialize
ipfs init

# Start daemon
ipfs daemon

# Update .env.local
VITE_IPFS_API_URL=http://localhost:5001
```

### 3. Compile Smart Contract

```bash
# Navigate to contracts directory
cd contracts

# Compile Compact contract
midnight compile whisper.compact -o ../build/whisper.wasm

# Verify compilation
ls -lh ../build/whisper.wasm
```

### 4. Deploy to Testnet

```bash
# Set network
export MIDNIGHT_NETWORK=testnet

# Deploy contract
midnight deploy \
  --contract build/whisper.wasm \
  --from wallet.json \
  --gas-limit 5000000 \
  --network testnet

# Save contract address
export CONTRACT_ADDRESS=<deployed_address>
```

### 5. Update Frontend Config

Edit `lib/midnight.ts`:

```typescript
// Replace mock functions with real SDK calls

import { MidnightClient } from '@midnight-network/sdk';

const client = new MidnightClient({
  network: import.meta.env.VITE_MIDNIGHT_NETWORK,
  rpcUrl: import.meta.env.VITE_MIDNIGHT_RPC_URL,
});

export async function initMidnight() {
  await client.connect();
  console.log('✅ Connected to Midnight network');
}

export async function postWhisper(ipfs_hash: string, proof: ProofPackage) {
  const tx = await client.contract(CONTRACT_ADDRESS).post_whisper({
    ipfs_hash,
    zk_proof: proof.proof,
    pub_inputs: proof.publicInputs,
  });
  
  await tx.wait();
}
```

### 6. Implement Real Encryption

Replace `lib/ipfs.ts` encryption:

```typescript
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

export function encryptMessage(plaintext: string, recipientPublicKey?: Uint8Array): string {
  // Generate ephemeral keypair
  const ephemeralKeyPair = nacl.box.keyPair();
  
  // Encrypt with public key cryptography
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageBytes = new TextEncoder().encode(plaintext);
  
  const encrypted = nacl.box(
    messageBytes,
    nonce,
    recipientPublicKey || ephemeralKeyPair.publicKey,
    ephemeralKeyPair.secretKey
  );
  
  // Package: nonce + encrypted data + public key
  const fullMessage = new Uint8Array(nonce.length + encrypted.length + ephemeralKeyPair.publicKey.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  fullMessage.set(ephemeralKeyPair.publicKey, nonce.length + encrypted.length);
  
  return encodeBase64(fullMessage);
}
```

### 7. Build for Production

```bash
# Build frontend
npm run build

# Output in dist/ directory
ls -lh dist/
```

---

## 🌍 Deployment Options

### Option 1: Decentralized (IPFS)

```bash
# Upload build to IPFS
ipfs add -r dist/

# Returns CID: QmXxx...
# Access via: https://ipfs.io/ipfs/QmXxx.../

# Pin on Pinata for persistence
curl -X POST "https://api.pinata.cloud/pinning/pinByHash" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"hashToPin": "QmXxx..."}'
```

### Option 2: Traditional Hosting

#### Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront

```bash
aws s3 sync dist/ s3://whisperchain-app
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

---

## 🧪 Testing

### Run Unit Tests

```bash
# Install test dependencies
npm install --save-dev vitest @testing-library/react

# Run tests
npm test

# Coverage report
npm run test:coverage
```

### Test Smart Contract

```bash
# Compile contract
midnight compile contracts/whisper.compact

# Run contract tests
midnight test contracts/whisper.compact

# Simulate transactions
midnight simulate --contract whisper --method post_whisper --args '[...]'
```

### Integration Testing

```bash
# Start local Midnight node
midnight node start --dev

# Deploy to local node
midnight deploy --network local

# Run E2E tests
npm run test:e2e
```

---

## 🐛 Troubleshooting

### Common Issues

#### "Failed to connect to Midnight network"

```bash
# Check network status
midnight network status

# Verify RPC URL
curl $VITE_MIDNIGHT_RPC_URL

# Try different RPC endpoint
export VITE_MIDNIGHT_RPC_URL=https://backup-rpc.midnight.network
```

#### "IPFS upload timeout"

```bash
# Increase timeout
export VITE_IPFS_TIMEOUT=60000

# Use different gateway
export VITE_IPFS_GATEWAY=https://dweb.link/ipfs/

# Check IPFS node
ipfs swarm peers  # Should show connections
```

#### "ZK proof generation failed"

```bash
# Verify circuit parameters
midnight circuit info

# Download latest proving keys
midnight circuit download

# Increase browser memory (dev mode)
node --max-old-space-size=4096 node_modules/.bin/vite
```

#### "Transaction reverted"

Check contract logs:

```bash
midnight logs --contract $CONTRACT_ADDRESS --tail 100
```

Common causes:
- Invalid ZK proof
- Nullifier already used
- Insufficient gas

---

## 🔐 Security Checklist

Before production deployment:

- [ ] Use real encryption (libsodium/tweetnacl)
- [ ] Implement proper key management
- [ ] Audit ZK circuits
- [ ] Rate limit transactions
- [ ] Add CAPTCHA for wallet creation
- [ ] Monitor for spam/abuse
- [ ] Set up error logging (Sentry)
- [ ] Configure CSP headers
- [ ] Enable HTTPS everywhere
- [ ] Backup private keys securely

---

## 📊 Monitoring

### Set Up Analytics

```typescript
// Add to App.tsx
import { useEffect } from 'react';

useEffect(() => {
  // Track page views
  if (typeof window !== 'undefined') {
    window.plausible?.('pageview');
  }
}, []);
```

### Contract Monitoring

```bash
# Monitor events
midnight events subscribe \
  --contract $CONTRACT_ADDRESS \
  --event WhisperPosted

# Check transaction count
midnight stats --contract $CONTRACT_ADDRESS
```

---

## 🚀 Performance Optimization

### Frontend

```javascript
// Lazy load components
const WhisperWall = lazy(() => import('./components/WhisperWall'));

// Optimize images
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
```

### Contract

```rust
// Use indexed events for fast queries
emit Event::WhisperPosted {
    #[indexed]
    proof_root: Hash,
    timestamp: u64,
};
```

---

## 📚 Additional Resources

- [Midnight Developer Docs](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [ZK Proof Tutorial](https://docs.midnight.network/zk-proofs)
- [IPFS Best Practices](https://docs.ipfs.tech/how-to/)

---

## 💬 Get Help

- Discord: [Midnight Community](https://discord.gg/midnight)
- GitHub Issues: Report bugs or request features
- Stack Overflow: Tag `midnight-blockchain`

---

<div align="center">

**Happy Building! 🌙**

Questions? Open an issue or reach out on Discord.

</div>
