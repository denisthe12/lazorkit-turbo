export interface KnowledgeItem {
  id: string;
  keyword: string; // Слово в коде, которое ищем
  title: string;
  description: string;
  proTip?: string; // Секрет для профи
  docLink?: string;
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: "lazorkit-provider",
    keyword: "LazorKitProvider",
    title: "LazorKit Context Provider",
    description: "The root component that initializes the SDK. It manages the connection to Solana RPC, the Paymaster service, and the authentication state (WebAuthn).",
    proTip: "Must be placed at the top of your React tree (layout.tsx). Ensures wallet state persists across pages.",
  },
  {
    id: "paymaster-config",
    keyword: "paymasterConfig",
    title: "Paymaster Configuration",
    description: "Settings for the Gas Sponsorship service (Kora). This allows users to send transactions with 0 SOL balance.",
    proTip: "Get your specific URL from the LazorKit Dashboard. Use 'devnet' URLs for testing.",
  },
  {
    id: "use-wallet",
    keyword: "useWallet",
    title: "useWallet Hook",
    description: "The primary React hook to interact with the wallet. Provides methods like connect(), signMessage(), and wallet state.",
    proTip: "Always check 'if (!isConnected)' before calling transaction methods to prevent errors.",
  },
  {
    id: "sign-send",
    keyword: "signAndSendTransaction",
    title: "Sign & Send (Smart)",
    description: "A high-level function that handles the full lifecycle: 1. Biometric Sign 2. Paymaster Negotiation 3. Submission to Solana.",
    proTip: "Unlike standard Solana wallets, this returns a Promise that resolves only when the Bundler accepts the tx.",
  },
  {
    id: "fee-token",
    keyword: "feeToken",
    title: "Fee Sponsorship Token",
    description: "Tells the Paymaster: 'Please pay the SOL gas fee for this transaction'.",
    proTip: "Setting this to 'USDC' allows the Paymaster to sponsor the tx in exchange for USDC (or for free if configured).",
  },
  {
    id: "system-transfer",
    keyword: "SystemProgram.transfer",
    title: "Native Transfer Instruction",
    description: "Standard Solana instruction to move SOL from one account to another.",
    proTip: "In LazorKit, the 'fromPubkey' must be the Smart Wallet address (wallet.smartWallet), not the device key.",
  },
  {
    id: "compute-limit",
    keyword: "computeUnitLimit",
    title: "Compute Unit Limit",
    description: "Sets a cap on execution resources. Important for Bundlers to accept the transaction.",
    proTip: "If your tx is complex, increase this. If it's too high, it might increase the priority fee cost.",
  }
];