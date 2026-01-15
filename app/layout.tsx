import "./polyfills";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LazorProvider } from "@/components/providers/LazorProvider"; // Импорт
import { Toaster } from "@/components/ui/sonner"; // Импорт уведомлений
import { LogsProvider } from "@/components/providers/LogsProvider";
import { DevModeProvider } from '@/components/providers/DevModeProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LazorKit Turbo",
  description: "Next-Gen Solana UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex justify-center min-h-screen bg-black`}>
        <LazorProvider>
          <LogsProvider>
            <DevModeProvider> {/* <-- Добавили */}
              <div className="w-full max-w-md h-[100dvh] bg-background relative flex flex-col shadow-2xl overflow-hidden border-x border-slate-800">
                {children}
              </div>
              <Toaster position="top-center" />
            </DevModeProvider> {/* <-- Закрыли */}
          </LogsProvider>
        </LazorProvider>
      </body>
    </html>
  );
}