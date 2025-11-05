# WhisperChain Architecture Documentation

## 🏛️ System Architecture

### Overview

WhisperChain implements a privacy-preserving anonymous messaging system using zero-knowledge proofs on the Midnight blockchain. The architecture separates concerns into three layers:

1. **Presentation Layer** (React Frontend)
2. **Privacy Layer** (ZK Proofs + Encryption)
3. **Persistence Layer** (Midnight Blockchain + IPFS)

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ React UI     │  │ Midnight SDK │  │ IPFS Client              │  │
│  │ Components   │  │ Integration  │  │ (Encryption + Upload)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────────────┘  │
│         │                 │                   │                       │
└─────────┼─────────────────┼───────────────────┼───────────────────────┘
          │                 │                   │
          ↓                 ↓                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        PRIVACY LAYER                                 │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Zero-Knowledge Proof Generation                              │  │
│  │                                                                │  │
│  │  Private Inputs:          Public Inputs:                      │  │
│  │  • Membership secret      • Merkle root                       │  │
│  │  • Merkle path            • Nullifier                         │  │
│  │  • Witness data           • Message commitment (optional)     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Client-Side Encryption (AES-GCM / NaCl)                      │  │
│  │  Message → Encrypt → Base64 → Upload to IPFS                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
          │                                    │
          ↓                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     PERSISTENCE LAYER                                │
│                                                                       │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐   │
│  │  Midnight Blockchain     │    │  IPFS Network                │   │
│  │                          │    │                              │   │
│  │  Compact Contract:       │    │  Stores:                     │   │
│  │  • Verify ZK proofs      │    │  • Encrypted messages        │   │
│  │  • Store metadata        │    │  • Content-addressed         │   │
│  │  • Emit events           │    │  • Decentralized             │   │
│  │  • Prevent replay        │    │                              │   │
│  └─────────────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Privacy Model

### Zero-Knowledge Proof Circuit

The ZK proof demonstrates membership in a community without revealing identity:

```
Circuit: MembershipProof

Private Inputs:
  - secret: u256           // User's secret key
  - path: MerklePath       // Path from leaf to root in membership tree
  - index: u64             // Position in tree

Public Inputs:
  - root: Hash             // Merkle root of membership tree
  - nullifier: Hash        // Unique identifier preventing double-use

Constraints:
  1. Verify Merkle path from leaf = Hash(secret) to root
  2. Nullifier = Hash(secret || index)
  3. Output: ✅ Proof Valid
```

### Privacy Guarantees

| Property | Mechanism | Guarantee |
|----------|-----------|-----------|
| Sender Anonymity | ZK Proof | No one knows who sent the message |
| Content Privacy | Client-Side Encryption | Only IPFS CID is public |
| Membership Verification | Merkle Tree + ZK | Proven member without revealing which one |
| No Double-Posting | Nullifiers | Each credential used once per message |
| Forward Secrecy | Ephemeral Keys (optional) | Past messages can't be decrypted |

---

## 📡 Data Flow

### Posting a Whisper

```
┌─────────┐
│ User    │
│ Types   │
│ Message │
└────┬────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 1. Client-Side Encryption            │
│    plaintext → encrypt() → ciphertext│
└────┬────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 2. Upload to IPFS                    │
│    ciphertext → IPFS → CID          │
└────┬────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 3. Generate ZK Proof                 │
│    secret + path → prove() → proof  │
└────┬────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 4. Submit Transaction                │
│    post_whisper(CID, proof, inputs) │
└────┬────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 5. Smart Contract Execution          │
│    • Verify proof                    │
│    • Check nullifier unused          │
│    • Store metadata                  │
│    • Emit event                      │
└────┬────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────┐
│ 6. Frontend Update                   │
│    Event listener → fetch → render  │
└─────────────────────────────────────┘
```

---

## 🗄️ Data Storage

### On-Chain Storage (Midnight Blockchain)

```rust
struct WhisperRecord {
    ipfs_hash: Hash,        // CID of encrypted message (32 bytes)
    proof_root: Hash,       // Merkle root used for verification (32 bytes)
    timestamp: u64,         // Block timestamp (8 bytes)
    community_root: Hash,   // Community identifier (32 bytes)
}

// Total: ~104 bytes per whisper
```

**Cost**: Minimal on-chain storage (only metadata)

### Off-Chain Storage (IPFS)

```json
{
  "encrypted_message": "base64_encrypted_content_here...",
  "timestamp": 1699123456,
  "version": "1.0"
}
```

**Benefits**:
- No blockchain bloat
- Permanent decentralized storage
- Content-addressed (integrity guaranteed)

---

## 🧩 Component Architecture

### Frontend Components

```
App.tsx
├── WalletConnect.tsx
│   └── Handles Midnight wallet connection
│
├── WhisperInput.tsx
│   ├── Message textarea
│   ├── Encryption logic
│   ├── ZK proof generation
│   └── Transaction submission
│
└── WhisperWall.tsx
    └── WhisperCard.tsx (multiple)
        ├── Message display
        ├── Proof badge
        ├── Reaction buttons
        └── Timestamp
```

### Library Modules

```
lib/
├── types.ts          # TypeScript interfaces
├── midnight.ts       # Midnight SDK wrapper
│   ├── initMidnight()
│   ├── fetchWhispers()
│   ├── postWhisper()
│   ├── createZKProofForMembership()
│   └── addReaction()
│
└── ipfs.ts           # IPFS helper
    ├── uploadToIPFS()
    ├── fetchFromIPFS()
    ├── encryptMessage()
    └── decryptMessage()
```

---

## 🔄 Smart Contract State Machine

```
┌─────────────┐
│  Contract   │
│  Deployed   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│  IDLE STATE                          │
│  • whispers: []                      │
│  • used_proofs: {}                   │
└──────┬──────────────────────────────┘
       │
       ↓ post_whisper() called
       │
┌──────▼──────────────────────────────┐
│  VERIFICATION                        │
│  • Verify ZK proof                   │
│  • Check nullifier not used          │
└──────┬──────────────────────────────┘
       │
       ├─→ FAIL → Revert transaction
       │
       ↓ SUCCESS
┌──────▼──────────────────────────────┐
│  STATE UPDATE                        │
│  • Push whisper to array             │
│  • Mark nullifier as used            │
│  • Emit WhisperPosted event          │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────▼──────────────────────────────┐
│  IDLE STATE (updated)                │
│  • whispers: [..., new]              │
│  • used_proofs: {..., nullifier}     │
└─────────────────────────────────────┘
```

---

## 🛡️ Security Considerations

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Identity Disclosure | ZK proofs hide sender, no on-chain correlation |
| Message Interception | Encrypted before leaving client |
| Replay Attacks | Nullifiers prevent proof reuse |
| Spam | Rate limiting (future: reputation scoring) |
| Impersonation | ZK proof verifies valid membership |
| Data Tampering | IPFS content-addressing + blockchain integrity |

### Trust Assumptions

1. **User trusts**:
   - Midnight blockchain consensus
   - IPFS network for availability
   - Their own client-side encryption

2. **System trusts**:
   - Midnight ZK verifier implementation
   - Merkle tree builder (off-chain admin)

3. **No need to trust**:
   - Other users
   - Frontend operator (verifiable)
   - IPFS nodes (content-addressed)

---

## ⚡ Performance Optimization

### Frontend

- **React.memo()** for expensive components
- **Lazy loading** for message history
- **Virtual scrolling** for large whisper lists (future)
- **Debounced reactions** to prevent spam

### Blockchain

- **Batch proof verification** (future optimization)
- **Indexed events** for fast queries
- **Minimal on-chain storage** (only metadata)

### IPFS

- **Pin important content** on dedicated nodes
- **Cache frequently accessed CIDs**
- **Gateways** for fallback retrieval

---

## 🧪 Testing Strategy

### Unit Tests
- ZK proof generation
- Encryption/decryption
- Contract state transitions

### Integration Tests
- End-to-end message flow
- Wallet connection
- IPFS upload/retrieval

### Security Tests
- Nullifier collision resistance
- Proof replay prevention
- Front-running protection

---

## 🚀 Deployment Guide

### Prerequisites

```bash
# Midnight CLI
npm install -g @midnight/cli

# IPFS node (optional, can use gateway)
ipfs daemon
```

### Contract Deployment

```bash
# Compile contract
midnight compile contracts/whisper.compact -o build/

# Deploy to testnet
midnight deploy build/whisper.wasm \
  --network testnet \
  --from YOUR_KEY \
  --gas-limit 5000000

# Verify deployment
midnight verify CONTRACT_ADDRESS
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to IPFS (for decentralized hosting)
ipfs add -r dist/

# Or deploy to traditional hosting
# Vercel, Netlify, etc.
```

---

## 📈 Scalability

### Current Limitations
- Linear scan for whisper retrieval
- All whispers loaded at once

### Future Improvements
- **Pagination**: Fetch whispers in batches
- **Indexing**: Off-chain indexer for fast queries
- **Layer 2**: Move message metadata to L2 for higher throughput
- **Sharding**: Separate whisper channels by community

---

## 🔮 Future Architecture Enhancements

### Phase 2: Encrypted Replies
```
Whisper → Generate ephemeral public key
Reply → Encrypt with whisper's public key
Only original sender can decrypt
```

### Phase 3: Reputation System
```
ZK proof of "I have N verified whispers"
Without revealing which whispers
Using ZK accumulators
```

### Phase 4: Cross-Chain
```
Bridge whispers to other blockchains
Unified gratitude ledger
Multi-chain ZK verification
```

---

## 📚 References

- [Midnight Documentation](https://docs.midnight.network)
- [ZK-SNARKs Explainer](https://z.cash/technology/zksnarks/)
- [IPFS Docs](https://docs.ipfs.tech)
- [Merkle Tree Membership Proofs](https://en.wikipedia.org/wiki/Merkle_tree)

---

<div align="center">

**Built with privacy, designed for kindness** 🌙

</div>
