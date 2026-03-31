import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("z4_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginWallet = async (walletAddress: string) => {
  const res = await api.post("/auth/login", { wallet_address: walletAddress });
  return res.data;
};

// Plots
export const fetchPlots = async (blockId?: string, status?: string) => {
  const params = new URLSearchParams();
  if (blockId) params.append("block_id", blockId);
  if (status) params.append("status", status);
  const res = await api.get(`/plots?${params.toString()}`);
  return res.data;
};

export const fetchBlocksSummary = async () => {
  const res = await api.get("/plots/blocks");
  return res.data;
};

export const fetchPlotById = async (plotId: string) => {
  const res = await api.get(`/plots/${plotId}`);
  return res.data;
};

// Token Sale
export const fetchTokenSalePreview = async () => {
  const res = await api.get("/token-sale/preview");
  return res.data;
};

export const buyTani = async (usdtAmount: string, txHash: string) => {
  const res = await api.post("/token-sale/buy", {
    usdt_amount: usdtAmount,
    tx_hash: txHash,
  });
  return res.data;
};

// Allocation
export const fetchAllocationPreview = async (plotId: string) => {
  const res = await api.get(`/allocations/preview/${plotId}`);
  return res.data;
};

export const createAllocation = async (
  plotId: string,
  allocationQuantity: number,
  txHash: string
) => {
  const res = await api.post("/allocations", {
    plot_id: plotId,
    allocation_quantity: allocationQuantity,
    tx_hash: txHash,
  });
  return res.data;
};

// Portfolio
export const fetchPortfolio = async () => {
  const res = await api.get("/portfolio");
  return res.data;
};
