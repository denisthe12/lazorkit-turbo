"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export type LogType = "transaction" | "signature" | "login" | "error";

export interface LogItem {
  id: string;
  type: LogType;
  title: string;
  hash?: string;
  timestamp: Date;
  status: "success" | "error";
}

interface LogsContextType {
  logs: LogItem[];
  addLog: (item: Omit<LogItem, "id" | "timestamp">) => void;
  // Новое: Сэкономленный газ
  savedAmount: number;
  addSavings: () => void;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [savedAmount, setSavedAmount] = useState(0);

  // Восстанавливаем сохраненное значение при загрузке
  useEffect(() => {
    const saved = localStorage.getItem("lazor_savings");
    if (saved) setSavedAmount(parseFloat(saved));
  }, []);

  const addLog = (item: Omit<LogItem, "id" | "timestamp">) => {
    const newLog = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev]);
    
    if (item.status === "success") {
      toast.success(item.title);
    } else {
      toast.error(item.title);
    }
  };

  const addSavings = () => {
    const newAmount = savedAmount + 0.05; // Каждая транзакция экономит $0.05 (примерно)
    setSavedAmount(newAmount);
    localStorage.setItem("lazor_savings", newAmount.toString());
  };

  return (
    <LogsContext.Provider value={{ logs, addLog, savedAmount, addSavings }}>
      {children}
    </LogsContext.Provider>
  );
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within LogsProvider");
  return context;
};