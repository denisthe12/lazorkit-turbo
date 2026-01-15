"use client";

import { ReactNode } from "react";
import { LazorkitProvider } from "@lazorkit/wallet";

export function LazorProvider({ children }: { children: ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com",
      }}
    >
      {children}
    </LazorkitProvider>
  );
}