"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { WalletView } from "@/components/views/WalletView";
import { ShopView } from "@/components/views/ShopView";
import { SaasView } from "@/components/views/SaasView";
import { DevView } from "@/components/views/DevView";
import { CodeDrawer } from "@/components/dev/CodeDrawer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("wallet");

  return (
    <>
      <Header />
      
      <main className="flex-1 overflow-y-auto relative bg-black/20">
        {activeTab === "wallet" && <WalletView />}
        {activeTab === "shop" && <ShopView />}
        {activeTab === "saas" && <SaasView />}
        {activeTab === "dev" && <DevView />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <CodeDrawer /> 
    </>
  );
}