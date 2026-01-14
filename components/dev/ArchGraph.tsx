"use client";

import { cn } from "@/lib/utils";
import { ArrowDown, Box, Layers, Layout, Zap } from "lucide-react";

type Node = {
  id: string;
  title: string;
  type: "provider" | "layout" | "page" | "component";
  desc: string;
  children?: Node[];
};

const ARCHITECTURE: Node = {
  id: "root",
  title: "app/layout.tsx",
  type: "layout",
  desc: "Global Wrap. Injects CSS and Fonts.",
  children: [
    {
      id: "lazor-provider",
      title: "LazorKitProvider",
      type: "provider",
      desc: "SDK Core. Handles RPC, WebAuthn & Paymaster.",
      children: [
        {
          id: "logs-provider",
          title: "LogsProvider",
          type: "provider",
          desc: "Stores transaction history & 'Saved Gas' state.",
          children: [
            {
              id: "dev-provider",
              title: "DevModeProvider",
              type: "provider",
              desc: "Manages 'Code View' toggle and Drawer state.",
              children: [
                {
                  id: "page",
                  title: "app/page.tsx",
                  type: "page",
                  desc: "Main Router. Switches tabs (Wallet/Shop/SaaS).",
                  children: [
                    {
                      id: "views",
                      title: "Views Components",
                      type: "component",
                      desc: "WalletView, ShopView, SaasView (Where logic lives).",
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function ArchGraph() {
  const renderNode = (node: Node, depth: number = 0) => {
    return (
      <div key={node.id} className="flex flex-col items-center animate-in fade-in duration-500">
        
        {/* Connector Line */}
        {depth > 0 && (
          <div className="h-8 w-0.5 bg-gradient-to-b from-white/20 to-white/50 my-1" />
        )}

        {/* Node Card */}
        <div className={cn(
          "relative group p-3 rounded-xl border w-64 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:z-10 cursor-default",
          node.type === "layout" && "bg-orange-500/10 border-orange-500/30",
          node.type === "provider" && "bg-blue-500/10 border-blue-500/30",
          node.type === "page" && "bg-purple-500/10 border-purple-500/30",
          node.type === "component" && "bg-green-500/10 border-green-500/30"
        )}>
          {/* Icon */}
          <div className="flex justify-center mb-2">
            {node.type === "layout" && <Layout className="w-5 h-5 text-orange-400" />}
            {node.type === "provider" && <Zap className="w-5 h-5 text-blue-400" />}
            {node.type === "page" && <Layers className="w-5 h-5 text-purple-400" />}
            {node.type === "component" && <Box className="w-5 h-5 text-green-400" />}
          </div>

          <h4 className="text-white font-mono text-sm font-bold">{node.title}</h4>
          
          {/* Tooltip (Description) */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-48 bg-zinc-900 border border-white/10 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-zinc-900" />
            <p className="text-xs text-gray-300 leading-tight">{node.desc}</p>
          </div>
        </div>

        {/* Children */}
        {node.children?.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center py-10 bg-zinc-950/50 min-h-full">
      {renderNode(ARCHITECTURE)}
      
      <div className="mt-8 text-xs text-gray-500 font-mono">
        * Hover over nodes to see details
      </div>
    </div>
  );
}