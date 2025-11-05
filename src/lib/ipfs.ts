// Mock IPFS helper for WhisperChain demo
// In production, replace with ipfs-http-client or web3.storage

import { EncryptedMessage } from './types';

/**
 * Uploads content to IPFS (mocked for demo)
 * @param content - The encrypted content to upload
 * @returns CID (Content Identifier)
 */
export async function uploadToIPFS(content: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a fake CID
  const cid = 'bafywhisper' + Math.random().toString(36).slice(2, 10);
  
  // Store in localStorage as mock IPFS
  const store = getIPFSStore();
  store[cid] = content;
  localStorage.setItem('whisper_ipfs', JSON.stringify(store));
  
  return cid;
}

/**
 * Retrieves content from IPFS (mocked for demo)
 */
export async function fetchFromIPFS(cid: string): Promise<string | null> {
  const store = getIPFSStore();
  return store[cid] || null;
}

/**
 * Client-side encryption using base64 (placeholder)
 * In production, use libsodium, tweetnacl, or similar for real encryption
 */
export function encryptMessage(plaintext: string): string {
  // Simple base64 encoding as placeholder for encryption
  return btoa(unescape(encodeURIComponent(plaintext)));
}

/**
 * Client-side decryption
 */
export function decryptMessage(encrypted: string): string {
  try {
    return decodeURIComponent(escape(atob(encrypted)));
  } catch {
    return '— encrypted —';
  }
}

function getIPFSStore(): Record<string, string> {
  return JSON.parse(localStorage.getItem('whisper_ipfs') || '{}');
}
