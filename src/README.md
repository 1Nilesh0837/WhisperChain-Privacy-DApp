# 🌙 WhisperChain

**A privacy-first gratitude ledger built for the Midnight blockchain**

WhisperChain enables anonymous, verified messages of kindness using zero-knowledge proofs. Send gratitude without revealing your identity — proven genuine through cryptographic verification on the Midnight platform.

---

## ✨ Concept

In a world of noise, WhisperChain lets you **whisper kindness privately**.

Each message is:
- 🔐 **Encrypted** client-side before storage
- 🌐 **Stored** on IPFS (decentralized)
- ✅ **Verified** via zero-knowledge proofs
- 🎭 **Anonymous** — no one knows who sent it
- 📜 **Immutable** — preserved forever on-chain

---

## 🎯 Features

### Core Functionality
- **Anonymous Posting**: Send messages without revealing your wallet address or identity
- **ZK Proof Verification**: Prove you're a verified community member without exposing which member
- **IPFS Storage**: Messages stored off-chain, encrypted, with only metadata on-chain
- **Wall of Whispers**: Public feed of verified anonymous messages
- **Reactions**: React with ❤️ 🌙 🌸 while staying anonymous

### Privacy Guarantees
- Zero-knowledge membership proofs
- Client-side encryption before upload
- No on-chain correlation to sender
- Nullifier system prevents double-posting
- Metadata-only blockchain storage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Client                          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │  Message   │→ │  Encrypt    │→ │  Upload to IPFS  │     │
│  │  Input     │  │  (client)   │  │  (get CID)       │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
│         │                                    │               │
│         ↓                                    ↓               │
│  ┌────────────────────────────┐    ┌───────────────┐       │
│  │  Generate ZK Proof         │    │  IPFS CID     │       │
│  │  (prove membership)        │    └───────────────┘       │
│  └────────────────────────────┘             │               │
└──────────────┬──────────────────────────────┼───────────────┘
               │                              │
               ↓                              ↓
┌──────────────────────────────────────────────────────────────┐
│              Midnight Blockchain (Compact Contract)           │
│                                                                │
│  1. Verify ZK Proof (membership + nullifier)                 │
│  2. Store { ipfs_cid, proof_root, timestamp }                │
│  3. Emit WhisperPosted event                                 │
│                                                                │
│  Storage: Only metadata on-chain                             │
│  Privacy: No link to sender identity                         │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User writes message** → Client encrypts locally
2. **Encrypted message** → Uploaded to IPFS (returns CID)
3. **Client generates ZK proof** → Proves membership in community
4. **Transaction submitted** → Contract verifies proof + stores metadata
5. **Event emitted** → Frontend updates Wall of Whispers

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Motion (Framer Motion)** for animations
- **Lucide React** for icons

### Smart Contract
- **Midnight Compact** language
- **Zero-knowledge proofs** for membership verification
- **Event emission** for frontend updates

### Storage & Privacy
- **IPFS** for encrypted message storage
- **Client-side encryption** (production: libsodium/tweetnacl)
- **ZK proofs** for anonymous authentication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/whisperchain
cd whisperchain

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Demo Mode

This version uses **localStorage mocks** for:
- Midnight SDK interactions
- IPFS storage
- ZK proof generation

Perfect for local testing and hackathon demos!

---

## 📖 How to Use

### 1. Connect Wallet
Click "Connect" to link your Midnight wallet (demo mode uses mock wallet)

### 2. Write a Whisper
Type your message of gratitude in the input box (max 500 characters)

### 3. Post Anonymously
Click "Whisper" to:
- Encrypt your message
- Upload to IPFS
- Generate ZK proof
- Post to blockchain

### 4. View Wall of Whispers
See all anonymous messages with verified badges

### 5. React to Messages
Show appreciation with ❤️ (heart), 🌙 (moon), or 🌸 (flower)

---

## 🔐 Security & Privacy

### What's Private
- ✅ Sender identity (hidden via ZK proofs)
- ✅ Message content (encrypted on IPFS)
- ✅ Wallet address (not correlated to messages)

### What's Public
- ✅ Proof verification metadata
- ✅ IPFS CID (content identifier)
- ✅ Timestamp of posting
- ✅ Community membership root hash

### Security Notes
- Messages encrypted client-side before upload
- ZK proofs prevent impersonation
- Nullifiers prevent double-posting
- No PII collected or stored on-chain

⚠️ **Note**: This demo uses simplified encryption. Production deployment should use:
- `libsodium` or `tweetnacl` for encryption
- Proper key management
- Audited ZK circuits

---

## 🎨 Design Philosophy

**Aesthetic**: Soft, poetic, calming

- **Colors**: Lavender, moonlight blue, indigo, purple gradients
- **Typography**: Clean, readable, with italic emphasis for messages
- **Animations**: Gentle floating effects for new whispers
- **Tone**: Warm, human-friendly, encouraging kindness

---

## 📁 Project Structure

```
whisperchain/
├── App.tsx                    # Main application component
├── components/
│   ├── WalletConnect.tsx      # Wallet connection UI
│   ├── WhisperInput.tsx       # Message input form
│   ├── WhisperCard.tsx        # Individual message display
│   └── WhisperWall.tsx        # Message feed
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── midnight.ts            # Midnight SDK wrapper (mocked)
│   └── ipfs.ts                # IPFS helper (mocked)
├── contracts/
│   └── whisper.compact        # Smart contract
└── README.md                  # This file
```

---

## 🔮 Future Extensions

### Phase 2: Enhanced Privacy
- [ ] Encrypted replies (sender can decrypt via shared secret)
- [ ] Reputation scoring using ZK accumulators
- [ ] Private reaction counting

### Phase 3: Community Features
- [ ] Multiple community channels (DAOs, teams, campuses)
- [ ] Moderation via threshold signatures
- [ ] Whisper threads (anonymous conversations)

### Phase 4: Advanced Features
- [ ] AI sentiment analysis (positive vibes only)
- [ ] Cross-chain bridges for multi-platform gratitude
- [ ] NFT badges for community milestones
- [ ] Anonymous gifting (attach tokens to whispers)

---

## 🧪 Testing

### Local Demo Testing

```bash
# Clear demo state
localStorage.clear()

# Post a whisper
1. Connect wallet
2. Write message
3. Click "Whisper"
4. See it appear on Wall

# Test reactions
Click ❤️ 🌙 🌸 icons on any whisper
```

### Smart Contract Testing

```bash
# Compile contract (requires Midnight CLI)
midnight compile contracts/whisper.compact

# Deploy to testnet
midnight deploy --network testnet

# Run tests
midnight test
```

---

## 🤝 Contributing

We welcome contributions! Areas to improve:

- Real Midnight SDK integration
- Production-grade encryption
- UI/UX enhancements
- Documentation
- Test coverage

---

## 📜 License

MIT License - feel free to use for hackathons, learning, and good vibes only 🌸

---

## 🏆 Hackathon Info

**Built for**: Midnight Privacy Mini DApps Hackathon  
**Track**: Privacy Mini DApps  
**Category**: Social Impact + Privacy Tech  

**What makes it special**:
- Real-world use case (gratitude, mental health, community building)
- Privacy-first design using ZK proofs
- Clean, accessible UI
- Complete documentation
- Extensible architecture

---

## 💬 Support

Questions? Ideas? Feedback?

- Open an issue on GitHub
- Join our Discord community
- Tweet us @WhisperChain

---

## 🌟 Acknowledgments

- **Midnight Team** for the amazing blockchain platform
- **IPFS** for decentralized storage
- **ZK Proof Researchers** for making privacy possible
- **Open Source Community** for the tools and libraries

---

<div align="center">

**Whisper kindness. Verify truth. Stay anonymous.** 🌙

Built with 💜 for a more compassionate web

</div>
