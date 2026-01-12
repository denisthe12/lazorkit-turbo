"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export type LogType = "transaction" | "signature" | "login" | "error";

export interface LogItem {
  id: string;
  type: LogType;
  title: string;
  hash?: string; // Если есть хеш транзакции
  timestamp: Date;
  status: "success" | "error";
}

interface LogsContextType {
  logs: LogItem[];
  addLog: (item: Omit<LogItem, "id" | "timestamp">) => void;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogItem[]>([]);

  const addLog = (item: Omit<LogItem, "id" | "timestamp">) => {
    const newLog = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    // Добавляем новый лог в начало списка
    setLogs((prev) => [newLog, ...prev]);
    
    // Дублируем в тост для наглядности
    if (item.status === "success") {
      toast.success(item.title);
    } else {
      toast.error(item.title);
    }
  };

  return (
    <LogsContext.Provider value={{ logs, addLog }}>
      {children}
    </LogsContext.Provider>
  );
}

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within LogsProvider");
  return context;
};