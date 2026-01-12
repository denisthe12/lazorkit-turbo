"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@lazorkit/wallet";
import { useLogs } from "@/components/providers/LogsProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Loader2, Clock, Check } from "lucide-react";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { DevWrapper } from "@/components/dev/DevWrapper";

export function SaasView() {
  const { connect, isConnected, signAndSendTransaction, wallet } = useWallet();
  const { addLog } = useLogs();
  
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [nextBilling, setNextBilling] = useState<Date | null>(null);

  // Проверяем LocalStorage при загрузке (имитация базы данных)
  useEffect(() => {
    const subData = localStorage.getItem("saas_subscription");
    if (subData) {
      const { active, nextBill } = JSON.parse(subData);
      setIsSubscribed(active);
      setNextBilling(new Date(nextBill));
    }
  }, []);

  const handleSubscribe = async () => {
    if (!isConnected || !wallet) {
      connect();
      return;
    }

    try {
      setLoading(true);
      toast.loading("Activating Subscription (Payment)...");

      // 1. Создаем транзакцию ОПЛАТЫ (как в магазине)
      // Адрес сервиса SaaS (куда уходят деньги)
      const serviceAddress = new PublicKey("7XH4b6yQ5S7Hj2w2w2w2w2w2w2w2w2w2w2w2w2w2w2w"); 
      
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: serviceAddress,
        lamports: 0.005 * LAMPORTS_PER_SOL, // Цена подписки
      });

      // 2. Отправляем в блокчейн
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: {
          feeToken: "USDC",
          computeUnitLimit: 100_000,
        }
      });

      console.log("Subscription Tx:", signature);

      // 3. Сохраняем "подписку" локально
      const nextDate = new Date();
      nextDate.setSeconds(nextDate.getSeconds() + 30); // MVP: След. оплата через 30 сек
      
      localStorage.setItem("saas_subscription", JSON.stringify({
        active: true,
        nextBill: nextDate
      }));

      setIsSubscribed(true);
      setNextBilling(nextDate);

      // 4. Логируем как ТРАНЗАКЦИЮ (теперь Solscan будет работать!)
      addLog({
        type: "transaction",
        title: "Activated Pro Plan ($5)",
        hash: signature, // <-- Это настоящий хеш транзакции
        status: "success"
      });
      
      toast.dismiss();
      toast.success("Subscription Active!", {
        description: "Payment successful on Devnet"
      });

    } catch (e: any) {
      console.error(e);
      toast.dismiss();
      toast.error("Subscription Failed");
      
      addLog({
        type: "error",
        title: "Subscription Failed",
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">SaaS Plans</h2>
        <p className="text-gray-400 text-xs">Recurring crypto payments</p>
      </div>

      <Card className={`border-white/10 p-6 space-y-6 transition-colors duration-500 ${isSubscribed ? 'bg-green-900/10 border-green-500/30' : 'bg-gradient-to-br from-blue-900/20 to-black'}`}>
        
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isSubscribed ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
            {isSubscribed ? <Check className="w-8 h-8 text-green-400" /> : <ShieldCheck className="w-8 h-8 text-blue-400" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Pro Access</h3>
            <p className="text-sm text-gray-400">{isSubscribed ? "Plan Active" : "Monthly Subscription"}</p>
          </div>
        </div>

        {isSubscribed ? (
          <div className="bg-black/40 rounded-lg p-4 space-y-2 border border-white/5">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-primary" />
              <span>Next billing in:</span>
            </div>
            {/* Для демо просто показываем время */}
            <div className="text-xl font-mono text-white">
              ~30 seconds
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              *In a real app, a background worker would verify recurring payments.
            </p>
          </div>
        ) : (
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">✓ Unlimited Gasless Tx</li>
            <li className="flex items-center gap-2">✓ Priority Support</li>
            <li className="flex items-center gap-2">✓ Early Access</li>
          </ul>
        )}

        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-2xl font-bold text-white">$5<span className="text-sm text-gray-500">/mo</span></span>
        </div>

        {!isSubscribed && (
          <DevWrapper tutorialId="subscription">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500 h-12 text-md font-bold"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Subscribe & Pay"}
            </Button>
          </DevWrapper>
        )}

        {isSubscribed && (
           <Button 
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-950/30"
            onClick={() => {
              localStorage.removeItem("saas_subscription");
              setIsSubscribed(false);
              toast.success("Subscription Cancelled");
            }}
          >
            Cancel Subscription
          </Button>
        )}
      </Card>
    </div>
  );
}