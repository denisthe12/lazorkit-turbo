"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Fingerprint, Zap, Share2 } from "lucide-react";
import { useState } from "react";

interface TransactionReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    type: "purchase" | "subscription";
    title: string;
    amount: string;
    signature: string;
    timestamp: Date;
  } | null;
}

export function TransactionReceipt({ open, onOpenChange, data }: TransactionReceiptProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-md p-0 overflow-hidden gap-0">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-6 text-center border-b border-white/5 relative">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Check className="w-8 h-8 text-green-500" strokeWidth={3} />
          </div>
          <DialogTitle className="text-xl font-bold text-white mb-1">
            Transaction Confirmed
          </DialogTitle>
          <p className="text-xs text-green-400 font-mono uppercase tracking-widest">
            On-Chain Success
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Main Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">Action</span>
              <span className="text-white font-medium">{data.title}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">Amount</span>
              <span className="text-white font-bold font-mono">{data.amount}</span>
            </div>
            
            {/* THE KILLER FEATURE: PAYMASTER VISUALIZATION */}
            <div className="flex justify-between items-center bg-green-500/5 p-3 rounded-lg border border-green-500/20">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs">Network Fee (Gas)</span>
                <span className="text-[10px] text-gray-500 line-through">0.000005 SOL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold text-sm">PAID BY LAZORKIT</span>
                <Zap className="w-4 h-4 text-yellow-400 fill-current animate-pulse" />
              </div>
            </div>
          </div>

          {/* Autopsy Section (Signers) */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
              Transaction Autopsy
            </p>
            
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Fingerprint className="w-3 h-3 text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="text-white">User Signature</span>
                <span className="text-xs text-gray-500 block">Biometric (FaceID) Verified</span>
              </div>
              <Check className="w-4 h-4 text-green-500" />
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <Zap className="w-3 h-3 text-purple-400" />
              </div>
              <div className="flex-1">
                <span className="text-white">Paymaster Signature</span>
                <span className="text-xs text-gray-500 block">Gas Sponsorship Verified</span>
              </div>
              <Check className="w-4 h-4 text-green-500" />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
              <a 
                href={`https://solscan.io/tx/${data.signature}?cluster=devnet`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Proof
              </a>
            </Button>
            <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}