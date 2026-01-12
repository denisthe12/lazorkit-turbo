"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  // Данные для отображения в шторке
  codeSnippet: { title: string; code: string } | null;
  openSnippet: (title: string, code: string) => void;
  closeSnippet: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState<{ title: string; code: string } | null>(null);

  const toggleDevMode = () => setIsDevMode(!isDevMode);
  
  const openSnippet = (title: string, code: string) => {
    // Открываем код только если режим включен
    if (isDevMode) {
      setCodeSnippet({ title, code });
    }
  };

  const closeSnippet = () => setCodeSnippet(null);

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, codeSnippet, openSnippet, closeSnippet }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) throw new Error("useDevMode must be used within DevModeProvider");
  return context;
};