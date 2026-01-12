"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { useLogs } from "@/components/providers/LogsProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShoppingBag, Zap } from "lucide-react";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { DevWrapper } from "@/components/dev/DevWrapper";

export function ShopView() {
  const { connect, isConnected, signAndSendTransaction, wallet } = useWallet();
  const { addLog } = useLogs();
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    if (!isConnected || !wallet) {
      connect();
      return;
    }

    try {
      setBuying(true);
      toast.loading("Processing Gasless Transaction...");

      // 1. Создаем транзакцию перевода 0.001 SOL
      // Адрес "магазина" (для теста можно рандомный или свой)
      const shopAddress = new PublicKey("H4spT3bH2P5hJg3h2w2w2w2w2w2w2w2w2w2w2w2w2w2w"); 
      
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: shopAddress,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      });

      // 2. Отправляем через LazorKit
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC", // Указание Paymaster'у
          computeUnitLimit: 100_000,
        }
      });

      console.log("Purchase Sig:", signature);
      
      // 3. Логируем успех
      addLog({
        type: "transaction",
        title: "Bought Cyber Sneakers",
        hash: signature,
        status: "success"
      });

    } catch (e: any) {
      console.error(e);
      addLog({
        type: "error",
        title: "Purchase Failed",
        status: "error"
      });
    } finally {
      setBuying(false);
      toast.dismiss();
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Lazor Shop</h2>
        <p className="text-gray-400 text-xs">Gas fees sponsored by Paymaster</p>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-black border-white/10 overflow-hidden">
        <div className="h-40 bg-purple-500/10 flex items-center justify-center relative">
           <ShoppingBag className="w-20 h-20 text-purple-400" />
           <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
             <Zap className="w-3 h-3 fill-current" /> GASLESS
           </div>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl text-white">Cyber Sneakers</h3>
              <p className="text-sm text-gray-400">Limited Edition Gen-Z</p>
            </div>
            <div className="text-right">
              <span className="block text-xl font-bold text-white">0.001 SOL</span>
            </div>
          </div>

          <DevWrapper tutorialId="gasless-buy">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 h-12 text-md font-bold"
              onClick={handleBuy}
              disabled={buying}
            >
              {buying ? <Loader2 className="animate-spin" /> : "Buy Now (Gasless)"}
            </Button>
          </DevWrapper>
        </div>
      </Card>
    </div>
  );
}