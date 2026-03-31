"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { loginWallet } from "@/lib/api";

export function useAuth() {
  const { publicKey, connected } = useWallet();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const res = await loginWallet(publicKey.toString());
      localStorage.setItem("z4_token", res.token);
      localStorage.setItem("z4_wallet", res.wallet_address);
      setToken(res.token);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    const stored = localStorage.getItem("z4_token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      handleLogin();
    } else if (!connected) {
      localStorage.removeItem("z4_token");
      setToken(null);
    }
  }, [connected, publicKey, handleLogin]);

  return {
    token,
    isAuthenticated: !!token && connected,
    isLoading,
    walletAddress: publicKey?.toString() || null,
  };
}
