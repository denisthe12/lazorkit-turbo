"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Tutorial, TUTORIALS } from "@/lib/tutorials";

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
  activeTutorial: Tutorial | null;
  openTutorial: (tutorialId: string) => void;
  closeTutorial: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);

  const toggleDevMode = () => setIsDevMode(!isDevMode);
  
  const openTutorial = (tutorialId: string) => {
    if (isDevMode && TUTORIALS[tutorialId]) {
      setActiveTutorial(TUTORIALS[tutorialId]);
    }
  };

  const closeTutorial = () => setActiveTutorial(null);

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, activeTutorial, openTutorial, closeTutorial }}>
      {children}
    </DevModeContext.Provider>
  );
}

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) throw new Error("useDevMode must be used within DevModeProvider");
  return context;
};