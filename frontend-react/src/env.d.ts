/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SSO_CLIENT_ID: string;
  readonly VITE_SSO_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 