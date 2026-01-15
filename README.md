# ⚡ LazorKit Turbo
> **The Ultimate Interactive Starter Kit for Passkey-Native Solana Apps.**  
> *Build Gasless, Seedless, and Smart Wallet experiences in minutes.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Flazorkit-turbo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![LazorKit SDK](https://img.shields.io/badge/LazorKit-SDK%20v2-purple)](https://docs.lazorkit.com/)

---

<div align="center">
  <!-- USER MODE: Делаем поуже, как телефон -->
  <h3>📱 User Experience (Mobile-First)</h3>
  <p><i>Seedless onboarding and Gasless transactions in seconds.</i></p>
  <img src="./public/Usermode.gif" width="45%" alt="User Mode Demo" />


  <!-- DEV MODE: Растягиваем на всю ширину -->
  <h3>💻 Developer Experience (Interactive Studio)</h3>
  <p><i>Built-in Code Generator, Architecture Graph, and Execution Tracer.</i></p>
  <img src="./public/Devmode.gif" width="100%" alt="Dev Mode Demo" />
</div>

---

## 🚀 Why LazorKit Turbo?

Integrating Passkeys and Account Abstraction is hard.  
**LazorKit Turbo** makes it easy. 

It's not just a demo template. It's an **Interactive Learning Environment** designed to help developers understand the *LazorKit SDK* by seeing it in action and inspecting the code in real-time.

### ✨ Killer Features

| Feature | Description |
|---------|-------------|
| **🔐 Passkey Auth** | Seamless login with FaceID / TouchID. No seed phrases. |
| **⚡ Gasless Transactions** | Users pay 0 SOL. Fees are sponsored by the Paymaster. |
| **🛠 Interactive Code Mode** | **Exclusive Feature:** Click any UI element to see the exact code that powers it. |
| **🔬 Live Simulation** | Visual debugger that shows the execution flow step-by-step. |
| **🧩 Dependency Graph** | Visual map of the Next.js project structure. |

---

## 🏗 Architecture Flow

How a Gasless Transaction works in LazorKit Turbo:

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Passkey as 🔐 Authenticator
    participant Paymaster as ⚡ Lazor Paymaster
    participant Solana as 🟣 Solana Network

    User->>App: Click "Buy Now"
    App->>Passkey: Request Signature (WebAuthn)
    Passkey-->>User: Biometric Prompt (FaceID)
    User->>Passkey: Authorize
    Passkey-->>App: Signed Challenge
    App->>Paymaster: Request Gas Sponsorship
    Paymaster-->>App: Signed Transaction (Fees Paid)
    App->>Solana: Send Bundle
    Solana-->>App: Confirmed (0x...)
```

---

## 🛠 Getting Started

Go from Zero to Hero in less than 2 minutes.

### 1. Clone the Repo

```bash
git clone https://github.com/denisthe12/lazorkit-turbo.git
cd lazorkit-turbo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
# Requires HTTPS for Passkeys!
# We recommend using ngrok for local development
ngrok http 3000
```

Open the `https://....ngrok-free.app` link on your phone or desktop.

> **Note:** WebAuthn (FaceID) requires a secure context (HTTPS) or `localhost`. It will not work on `http://192.168.x.x`.

---

## 📚 Interactive Tutorials

Don't just read docs. **Experience them.**
Turn on **DEV MODE** (top right switch) in the app to access these guides:

### 1. Wallet Connection
Learn how to wrap your app with `LazorKitProvider` and implement the `useWallet` hook for biometric authentication.

### 2. Gasless Transactions
See how to send SPL transfers where the merchant pays the network fee, creating a true "Web2-like" payment experience.

### 3. Recurring Payments (SaaS)
Implement a subscription model where users sign a transaction once to authorize payments.

---

## 📚 Step-by-Step Guides

LazorKit Turbo includes built-in interactive tutorials, but here is a quick reference for the core concepts required by the Hackathon.

### Guide 1: How to create a Passkey-based Wallet

To onboard users without seed phrases, wrap your app with the Provider and use the `connect()` hook.

**1. Configure Provider (layout.tsx)**

```tsx
import { LazorKitProvider } from "@lazorkit/wallet";

export function App({ children }) {
  return (
    <LazorKitProvider
      rpcUrl="https://api.devnet.solana.com"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com" // Kora Paymaster
      }}
    >
      {children}
    </LazorKitProvider>
  );
}
```

**2. Trigger Login (Component)**

```tsx
import { useWallet } from "@lazorkit/wallet";

export function LoginBtn() {
  const { connect, isConnecting } = useWallet();
  // This triggers the browser's native FaceID/TouchID dialog
  return <button onClick={() => connect()}>Login with Passkey</button>;
}
```

---

### Guide 2: How to trigger a Gasless Transaction

LazorKit allows users with 0 SOL to interact with the blockchain by using a Paymaster.

**1. Create a Standard Solana Instruction**

```tsx
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const transferIx = SystemProgram.transfer({
  fromPubkey: wallet.smartWallet, // The user's PDA address
  toPubkey: new PublicKey("MERCHANT_ADDRESS"),
  lamports: 0.01 * LAMPORTS_PER_SOL,
});
```

**2. Send with Sponsorship**

```tsx
const { signAndSendTransaction } = useWallet();

await signAndSendTransaction({
  instructions: [transferIx],
  transactionOptions: {
    // Setting feeToken tells the Paymaster to sponsor the SOL fee
    feeToken: "USDC",
    // Optional: Optimize limits for complex instructions
    computeUnitLimit: 50_000 
  }
});
```

---

### Guide 3: How to Persist Session

LazorKit handles session persistence automatically via LocalStorage, but you need to handle the UI state correctly to prevent "flickering".

```tsx
const { isConnected } = useWallet();
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  // LazorKit takes ~500ms to restore session from storage
  if (isConnected) {
    setIsReady(true);
  }
}, [isConnected]);

if (!isReady) return <LoadingSpinner />;
return <Dashboard />;
```

---

## 🔧 Troubleshooting

If you encounter issues, open the **"Fix"** tab in the Dev Mode drawer.

*   **Error: Transaction too large** -> We automatically optimize instruction size.
*   **Error: 0x1783 (Too old)** -> We force a fresh blockhash simulation.
*   **WebAuthn Not Supported** -> Ensure you are using HTTPS (ngrok).

---

## 🏆 Hackathon Goals Checklist

- [x] **Clarity & Usefulness:** Built-in interactive code viewer and tutorials.
- [x] **SDK Integration:** Full Passkey + Paymaster + Smart Wallet support.
- [x] **Code Structure:** Clean Next.js 14 App Router architecture.
- [x] **Real-World Use Case:** E-commerce and SaaS examples.

---

Built with ❤️ for the **LazorKit Hackathon 2025**.