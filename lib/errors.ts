export type KnownError = {
  id: string;
  title: string;
  code: string;
  cause: string;
  solution: string;
};

export const KNOWN_ERRORS: KnownError[] = [
  {
    id: "tx-large",
    title: "Transaction too large",
    code: "Error: Transaction too large: 1315 > 1232",
    cause: "Solana legacy transactions are limited to 1232 bytes. LazorKit adds significant overhead with WebAuthn signatures and Paymaster data.",
    solution: "1. Remove unnecessary options like `computeUnitLimit` (Paymaster handles it).\n2. Use Address Lookup Tables (ALT) for complex transactions.\n3. Reduce the number of instructions per transaction."
  },
  {
    id: "webauthn-tls",
    title: "WebAuthn Not Supported",
    code: "NotAllowedError: WebAuthn is not supported on sites with TLS certificate errors",
    cause: "Passkeys (WebAuthn) require a secure context (HTTPS) to work. They will fail on http://localhost.",
    solution: "Use `ngrok` to create a secure tunnel for local development: `ngrok http 3000`."
  },
  {
    id: "tx-old",
    title: "Transaction is too old",
    code: "Error processing Instruction 0: custom program error: 0x1783",
    cause: "The blockhash used in the transaction expired before the transaction could be processed. Common when user takes too long to sign with FaceID.",
    solution: "1. Use `commitment: 'finalized'` when fetching blockhash.\n2. Add `clusterSimulation: 'devnet'` to transaction options to force a fresh simulation."
  }
];