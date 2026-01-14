"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Circle, Loader2, AlertTriangle, ArrowDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Типы шагов симуляции
type TraceStep = {
  id: string;
  title: string;
  status: "pending" | "running" | "success" | "error";
  details?: string; // JSON или описание
  icon?: React.ReactNode;
};

// Сценарии для разных туториалов
const SCENARIOS: Record<string, TraceStep[]> = {
  "gasless-buy": [
    { id: "1", title: "App: Initiate Transaction", status: "pending", details: "Calling signAndSendTransaction({ feeToken: 'USDC' })" },
    { id: "2", title: "SDK: Build Transaction", status: "pending", details: "Creating Solana Instruction: Transfer 0.001 SOL" },
    { id: "3", title: "WebAuthn: Request Signature", status: "pending", details: "Waiting for user FaceID/TouchID..." },
    { id: "4", title: "Paymaster: Negotiate Fee", status: "pending", details: "Sending request to Kora (https://kora.lazor.sh)..." },
    { id: "5", title: "Paymaster: Approved", status: "pending", details: "Response: 200 OK. Bundler accepted transaction." },
    { id: "6", title: "Solana: Confirm Block", status: "pending", details: "Transaction finalized on-chain." },
  ],
  "wallet-login": [
    { id: "1", title: "App: Connect Wallet", status: "pending", details: "Calling connect()" },
    { id: "2", title: "SDK: Check Session", status: "pending", details: "Checking localStorage for existing credentials..." },
    { id: "3", title: "WebAuthn: Challenge", status: "pending", details: "Browser prompts user for Passkey." },
    { id: "4", title: "Smart Wallet: Derive Address", status: "pending", details: "PDA derived: 7Xh...4f2" },
    { id: "5", title: "App: Connected", status: "pending", details: "Wallet object available in React Context." },
  ],
  "subscription": [
    { id: "1", title: "App: Subscribe", status: "pending", details: "Initiating monthly payment tx..." },
    { id: "2", title: "SDK: Sign Transaction", status: "pending", details: "Signing transfer instruction with Passkey." },
    { id: "3", title: "Paymaster: Sponsor Gas", status: "pending", details: "Network fee (0.000005 SOL) covered by Protocol." },
    { id: "4", title: "Solana: Execute Transfer", status: "pending", details: "Moved 0.005 SOL to Service Wallet." },
    { id: "5", title: "App: Update State", status: "pending", details: "LocalStorage updated: is_pro_member = true." },
  ]
};

interface LiveTracerProps {
  scenarioId: string;
}

export function LiveTracer({ scenarioId }: LiveTracerProps) {
  const [steps, setSteps] = useState<TraceStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Загружаем начальный сценарий
  useEffect(() => {
    const initialSteps = SCENARIOS[scenarioId] || SCENARIOS["gasless-buy"];
    setSteps(JSON.parse(JSON.stringify(initialSteps))); // Deep copy
    setIsRunning(false);
  }, [scenarioId]);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Сброс статусов
    setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));

    // Запуск по шагам
    for (let i = 0; i < steps.length; i++) {
      // Ставим текущий шаг в running
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[i].status = "running";
        return newSteps;
      });

      // Имитация задержки (разная для разных шагов для реализма)
      const delay = Math.random() * 800 + 500; 
      await new Promise(r => setTimeout(r, delay));

      // Ставим успех
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[i].status = "success";
        return newSteps;
      });
      
      // Автоскролл вниз
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }

    setIsRunning(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Controls */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="text-sm font-medium text-white">Execution Simulator</div>
        <Button 
          size="sm" 
          onClick={runSimulation} 
          disabled={isRunning}
          className={isRunning ? "bg-zinc-700" : "bg-green-600 hover:bg-green-500"}
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "Running..." : "Run Test"}
        </Button>
      </div>

      {/* Trace Log */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 pb-20" ref={scrollRef}>
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-8 group">
              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className={`absolute left-[11px] top-8 bottom-[-24px] w-[2px] transition-colors duration-500 ${
                  step.status === "success" ? "bg-green-500/50" : "bg-white/10"
                }`} />
              )}

              {/* Status Icon */}
              <div className={`absolute left-0 top-1 transition-all duration-300 ${
                step.status === "running" ? "scale-125" : ""
              }`}>
                {step.status === "pending" && <Circle className="w-6 h-6 text-gray-600 fill-black" />}
                {step.status === "running" && <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />}
                {step.status === "success" && <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-900/20" />}
              </div>

              {/* Step Content */}
              <div className={`p-3 rounded-lg border transition-all duration-500 ${
                step.status === "running" 
                  ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                  : step.status === "success"
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-white/5 border-white/5 opacity-50"
              }`}>
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold ${
                    step.status === "running" ? "text-blue-300" : "text-white"
                  }`}>
                    {step.title}
                  </h4>
                  {step.status === "running" && <span className="text-[10px] text-blue-400 animate-pulse">Processing...</span>}
                </div>
                
                {/* Details / JSON */}
                <div className="mt-2 text-xs font-mono text-gray-400 bg-black/30 p-2 rounded border border-white/5 break-all">
                  {step.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}