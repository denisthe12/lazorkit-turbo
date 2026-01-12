export const SHOP_CODE = `// 1. Create Transaction (Gasless)
const instruction = SystemProgram.transfer({
  fromPubkey: wallet.smartWallet,
  toPubkey: shopAddress,
  lamports: 0.001 * LAMPORTS_PER_SOL,
});

// 2. Sign & Send via LazorKit
// Paymaster handles the fees automatically
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: "USDC", // Request Fee Sponsorship
    computeUnitLimit: 100_000,
  }
});`;

export const SAAS_CODE = `// 1. Create Recurring Payment Tx
const instruction = SystemProgram.transfer({
  fromPubkey: wallet.smartWallet,
  toPubkey: serviceAddress,
  lamports: 5 * LAMPORTS_PER_SOL, 
});

// 2. Execute Payment
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: { feeToken: "USDC" }
});

// 3. Store Subscription State
// In production, index this sig on backend
localStorage.setItem("sub_active", true);`;

export const WALLET_CODE = `// Connect with FaceID / Passkey
const { connect, wallet } = useWallet();

// Login Function
const handleLogin = async () => {
  await connect();
  console.log("Smart Wallet:", wallet.smartWallet);
};

// LazorKit Provider Setup
<LazorKitProvider
  rpcUrl="https://api.devnet.solana.com"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
  {children}
</LazorKitProvider>`;