/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIDNIGHT_RPC: string;
  readonly VITE_MIDNIGHT_WALLET_ADDRESS: string;
  readonly VITE_MIDNIGHT_CONTRACT_ADDRESS: string;
  readonly VITE_WEB3STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
