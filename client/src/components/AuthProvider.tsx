"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
