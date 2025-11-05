// WhisperChain TypeScript Types

export interface WhisperRecord {
  ipfs_hash: string;
  proof_root: string;
  timestamp: number;
  preview?: string;
  reactions?: ReactionCount;
}

export interface ReactionCount {
  heart: number;
  moon: number;
  flower: number;
}

export interface ProofPackage {
  proof: string;
  publicInputs: {
    root_hash: string;
    membership_id?: string;
  };
}

export interface EncryptedMessage {
  content: string;
  timestamp: number;
}

export type ReactionType = 'heart' | 'moon' | 'flower';
