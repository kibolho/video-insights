"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { AlertProvider } from "@/contexts/alert-context";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>{children}</AlertProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
