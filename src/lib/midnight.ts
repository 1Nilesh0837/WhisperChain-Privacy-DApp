// Mock wrapper for Midnight SDK interactions
// Replace with actual midnight-sdk when deploying to testnet

import { WhisperRecord, ProofPackage, ReactionType } from './types';
import { decryptMessage } from './ipfs';

/**
 * Initialize the Midnight SDK (mocked)
 */
export async function initMidnight(): Promise<void> {
  // In production: initialize actual Midnight SDK
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('🌙 Midnight SDK initialized (demo mode)');
}

/**
 * Fetch all whispers from the smart contract
 */
export async function fetchWhispers(): Promise<WhisperRecord[]> {
  const stored = JSON.parse(localStorage.getItem('whisperchain_whispers') || '[]');
  const ipfsStore = JSON.parse(localStorage.getItem('whisper_ipfs') || '{}');
  
  // Attach preview and reactions to each whisper
  return stored.map((w: WhisperRecord) => ({
    ...w,
    preview: ipfsStore[w.ipfs_hash] ? decryptMessage(ipfsStore[w.ipfs_hash]).slice(0, 200) : undefined,
    reactions: w.reactions || { heart: 0, moon: 0, flower: 0 }
  }));
}

/**
 * Post a new whisper to the blockchain
 * @param ipfs_hash - CID of the encrypted message on IPFS
 * @param proofPackage - ZK proof package proving membership
 */
export async function postWhisper(
  ipfs_hash: string,
  proofPackage: ProofPackage
): Promise<void> {
  // Simulate blockchain transaction delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In production: call midnight-sdk to invoke contract method `post_whisper`
  const stored = JSON.parse(localStorage.getItem('whisperchain_whispers') || '[]');
  
  const newWhisper: WhisperRecord = {
    ipfs_hash,
    proof_root: proofPackage.publicInputs.root_hash,
    timestamp: Math.floor(Date.now() / 1000),
    reactions: { heart: 0, moon: 0, flower: 0 }
  };
  
  stored.push(newWhisper);
  localStorage.setItem('whisperchain_whispers', JSON.stringify(stored));
}

/**
 * Create a ZK proof for community membership
 * In production: use Midnight's ZK proof generation SDK
 */
export async function createZKProofForMembership(): Promise<ProofPackage> {
  // Simulate proof generation delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    proof: 'zkp_' + Math.random().toString(36).slice(2, 16),
    publicInputs: {
      root_hash: 'root' + Math.random().toString(36).slice(2, 12),
      membership_id: 'member_' + Math.random().toString(36).slice(2, 8)
    }
  };
}

/**
 * Add an anonymous reaction to a whisper
 */
export async function addReaction(
  whisperIndex: number,
  reactionType: ReactionType
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stored = JSON.parse(localStorage.getItem('whisperchain_whispers') || '[]');
  
  if (stored[whisperIndex]) {
    if (!stored[whisperIndex].reactions) {
      stored[whisperIndex].reactions = { heart: 0, moon: 0, flower: 0 };
    }
    stored[whisperIndex].reactions[reactionType]++;
    localStorage.setItem('whisperchain_whispers', JSON.stringify(stored));
  }
}

/**
 * Mock wallet connection
 */
export async function connectWallet(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const configuredAddress = import.meta.env.VITE_MIDNIGHT_WALLET_ADDRESS;
  if (configuredAddress && configuredAddress.trim().length > 0) {
    console.log('🔗 Loaded Midnight wallet address from environment');
    return configuredAddress.trim();
  }

  return 'midnight1' + Math.random().toString(36).slice(2, 20);
}
