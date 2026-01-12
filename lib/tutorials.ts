export type TutorialStep = {
  title: string;
  description: string;
  language: "bash" | "tsx" | "typescript";
  code: string;
};

export type Tutorial = {
  id: string;
  title: string;
  steps: TutorialStep[];
};

export const TUTORIALS: Record<string, Tutorial> = {
  "wallet-login": {
    id: "wallet-login",
    title: "Integration: Passkey Login",
    steps: [
      {
        title: "1. Installation",
        description: "First, install the core LazorKit SDK and Solana dependencies.",
        language: "bash",
        code: `npm install @lazorkit/wallet @solana/web3.js @solana/wallet-adapter-react buffer`
      },
      {
        title: "2. Setup Provider",
        description: "Wrap your application with LazorKitProvider. This handles the WebAuthn logic and Paymaster connection globally.",
        language: "tsx",
        code: `// app/providers.tsx
"use client";
import { LazorKitProvider } from "@lazorkit/wallet";

export function AppProvider({ children }) {
  return (
    <LazorKitProvider
      rpcUrl="https://api.devnet.solana.com"
      paymasterConfig={{
        // Get this URL from LazorKit Dashboard
        paymasterUrl: "https://kora.devnet.lazorkit.com",
      }}
    >
      {children}
    </LazorKitProvider>
  );
}`
      },
      {
        title: "3. Connect Button",
        description: "Use the `useWallet` hook to trigger the FaceID/TouchID login flow.",
        language: "tsx",
        code: `import { useWallet } from "@lazorkit/wallet";

export function LoginButton() {
  const { connect, isConnected, isConnecting } = useWallet();

  return (
    <button onClick={() => connect()} disabled={isConnecting}>
      {isConnecting ? "Verifying FaceID..." : "Login with Passkey"}
    </button>
  );
}`
      }
    ]
  },
  "gasless-buy": {
    id: "gasless-buy",
    title: "Integration: Gasless Transactions",
    steps: [
      {
        title: "1. The Concept",
        description: "With LazorKit, you don't need SOL to pay for gas. The Paymaster sponsors the transaction fees for the user. You just need to specify the `feeToken` (or let Paymaster handle it).",
        language: "typescript",
        code: `// No installation needed if SDK is already setup.
// Ensure your Paymaster is funded in the LazorKit Dashboard.`
      },
      {
        title: "2. Create Instruction",
        description: "Create a standard Solana instruction. This is what you want to execute (e.g., Transfer SOL, Mint NFT).",
        language: "typescript",
        code: `import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Example: Transfer 0.001 SOL (or USDC)
const instruction = SystemProgram.transfer({
  fromPubkey: wallet.smartWallet, // User's Smart Wallet PDA
  toPubkey: new PublicKey("MERCHANT_ADDRESS"),
  lamports: 0.001 * LAMPORTS_PER_SOL,
});`
      },
      {
        title: "3. Sign & Send (Gasless)",
        description: "Use `signAndSendTransaction`. The SDK automatically routes this through the Paymaster.",
        language: "tsx",
        code: `const { signAndSendTransaction } = useWallet();

const handleBuy = async () => {
  const signature = await signAndSendTransaction({
    instructions: [instruction],
    transactionOptions: { 
      // This tells LazorKit to use the Paymaster
      feeToken: "USDC", 
      computeUnitLimit: 100_000 
    }
  });
  
  console.log("Gasless Tx Confirmed:", signature);
};`
      }
    ]
  },
  "subscription": {
    id: "subscription",
    title: "Integration: Recurring Payments",
    steps: [
      {
        title: "1. Logic",
        description: "For MVP, a subscription is a transaction that authorizes payment. In production, you would use Session Keys for auto-deduction.",
        language: "typescript",
        code: `// We will trigger a real on-chain payment to activate the plan.`
      },
      {
        title: "2. Execute Payment",
        description: "Trigger the payment transaction. Once confirmed, grant access to the user.",
        language: "tsx",
        code: `const activateSubscription = async () => {
  // 1. Send Payment (Gasless)
  const sig = await signAndSendTransaction({
    instructions: [/* Transfer Instruction to SaaS Wallet */],
    transactionOptions: { feeToken: 'USDC' }
  });

  // 2. Verify & Grant Access
  if (sig) {
    // Save state to DB or LocalStorage
    localStorage.setItem("is_pro_member", "true");
    toast.success("Welcome to Pro Plan!");
  }
};`
      }
    ]
  }
};