"use client";

import { ReactNode } from "react";
import { LazorkitProvider } from "@lazorkit/wallet";

if (typeof window !== 'undefined') {
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
  if (typeof (window as any).Buffer === 'undefined') {
    (window as any).Buffer = require('buffer').Buffer;
  }
}

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