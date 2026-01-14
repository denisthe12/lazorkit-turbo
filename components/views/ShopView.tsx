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
import { TransactionReceipt } from "@/components/feedback/TransactionReceipt"; // Импорт

export function ShopView() {
  const { connect, isConnected, signAndSendTransaction, wallet } = useWallet();
  const { addLog } = useLogs();
  const [buying, setBuying] = useState(false);
  
  // Состояние для чека
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleBuy = async () => {
    if (!isConnected || !wallet) {
      connect();
      return;
    }

    try {
      setBuying(true);
      toast.loading("Processing Gasless Transaction...");

      // Адрес смарт-кошелька (сам себе для теста)
      const shopAddress = new PublicKey("G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY"); 
      
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: shopAddress, // Теперь шлем магазину, а не себе
        lamports: 0.001 * LAMPORTS_PER_SOL,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC",
          // ВАЖНО: Возвращаем лимит, но ставим адекватный для перевода
          computeUnitLimit: 50_000, 
          // ВАЖНО: Пробуем forced simulation (иногда помогает)
          clusterSimulation: 'devnet' 
        }
      });

      console.log("Purchase Sig:", signature);
      
      addLog({
        type: "transaction",
        title: "Bought Cyber Sneakers",
        hash: signature,
        status: "success"
      });

      toast.dismiss();
      
      // ПОКАЗЫВАЕМ ЧЕК ВМЕСТО ТОСТА
      setReceiptData({
        type: "purchase",
        title: "Cyber Sneakers",
        amount: "0.001 SOL",
        signature: signature,
        timestamp: new Date()
      });

    } catch (e: any) {
      console.error(e);
      toast.dismiss();
      addLog({
        type: "error",
        title: "Purchase Failed",
        status: "error"
      });
      toast.error("Transaction Failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in">
      {/* Рендерим диалог чека */}
      <TransactionReceipt 
        open={!!receiptData} 
        onOpenChange={(open) => !open && setReceiptData(null)}
        data={receiptData}
      />

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