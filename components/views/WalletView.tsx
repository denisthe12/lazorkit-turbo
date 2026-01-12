"use client";

import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fingerprint, LogOut, Copy, RefreshCw, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { DevWrapper } from "@/components/dev/DevWrapper";
import { WALLET_CODE } from "@/lib/snippets";

export function WalletView() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  
  // Новое состояние: Проверка сессии при загрузке страницы
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Логика инициализации (убираем мигание)
  useEffect(() => {
    const checkSession = async () => {
      // Если SDK уже подключился — супер, убираем загрузку сразу
      if (isConnected) {
        setIsCheckingSession(false);
        return;
      }

      // Если нет, даем SDK немного времени на авто-подключение (500мс)
      // Если через 500мс всё еще не подключен — значит юзер реально не залогинен
      const timer = setTimeout(() => {
        setIsCheckingSession(false);
      }, 800);

      return () => clearTimeout(timer);
    };

    checkSession();
  }, [isConnected]);

  // Функция получения баланса
  const fetchBalance = async () => {
    if (!wallet?.smartWallet) return;
    
    try {
      setLoadingBalance(true);
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const pubKey = new PublicKey(wallet.smartWallet);
      const bal = await connection.getBalance(pubKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error("Error fetching balance:", e);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    }
  }, [isConnected, wallet]);

  const copyAddress = () => {
    if (wallet?.smartWallet) {
      navigator.clipboard.writeText(wallet.smartWallet);
      toast.success("Address copied to clipboard!");
    }
  };

  const requestAirdrop = async () => {
    if (!wallet?.smartWallet) return;
    
    console.log("--- Starting Airdrop ---");
    try {
      setAirdropping(true);
      toast.info("Requesting Airdrop... Please wait.");
      
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const signature = await connection.requestAirdrop(
        new PublicKey(wallet.smartWallet),
        1 * LAMPORTS_PER_SOL
      );
      
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      toast.success("Airdrop received! +1 SOL");
      fetchBalance(); 
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("429")) {
        toast.error("Devnet faucet is busy (429). Try again later.");
      } else {
        toast.error(`Airdrop failed: ${e.message}`);
      }
    } finally {
      setAirdropping(false);
    }
  };

  // ------------------- UI: ЗАГРУЗКА (SPLASH SCREEN) -------------------
  // Показываем это, пока проверяем сессию или пока идет коннект
  if (isCheckingSession || isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-2xl opacity-40 rounded-full animate-pulse" />
          <div className="bg-black/50 p-4 rounded-2xl border border-white/10 relative z-10">
            <Zap className="w-10 h-10 text-primary animate-pulse" fill="currentColor" />
          </div>
        </div>
        <p className="text-sm text-gray-500 font-medium">Securing connection...</p>
      </div>
    );
  }

  // ------------------- UI: НЕ АВТОРИЗОВАН -------------------
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full" />
          <Fingerprint className="w-24 h-24 text-primary relative z-10" strokeWidth={1} />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm max-w-[250px] mx-auto">
            Login with your FaceID or TouchID to access your smart wallet.
          </p>
        </div>

        <DevWrapper title="Passkey Login" code={WALLET_CODE}>
          <Button 
            size="lg" 
            className="w-full max-w-xs h-12 text-md font-semibold bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all"
            onClick={() => connect()}
          >
            <Fingerprint className="mr-2 h-5 w-5" /> Login with Passkey
          </Button>
        </DevWrapper>
      </div>
    );
  }

  // ------------------- UI: АВТОРИЗОВАН -------------------
  return (
    <div className="flex flex-col h-full p-4 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
      
      {/* Карточка баланса */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        
        <div className="space-y-1 relative z-10">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Balance</p>
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-bold text-white">
              {balance !== null ? balance.toFixed(4) : "..."}
            </h1>
            <span className="text-primary font-bold">SOL</span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 bg-white/5 p-2 rounded-lg w-fit cursor-pointer hover:bg-white/10 transition-colors active:scale-95" onClick={copyAddress}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <code className="text-xs text-gray-300 font-mono">
            {wallet?.smartWallet.slice(0, 6)}...{wallet?.smartWallet.slice(-6)}
          </code>
          <Copy className="w-3 h-3 text-gray-500" />
        </div>
      </Card>

      {/* Действия */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="bg-white/5 border-white/10 hover:bg-white/10 h-24 flex flex-col gap-2 hover:border-primary/50 transition-all"
          onClick={requestAirdrop}
          disabled={airdropping}
        >
          {airdropping ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <RefreshCw className="w-6 h-6 text-primary" />}
          <span className="text-xs">Airdrop</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-white/5 border-white/10 hover:bg-red-900/20 hover:border-red-900/50 h-24 flex flex-col gap-2 group transition-all"
          onClick={() => disconnect()}
        >
          <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="text-xs group-hover:text-red-400">Disconnect</span>
        </Button>
      </div>
    </div>
  );
}