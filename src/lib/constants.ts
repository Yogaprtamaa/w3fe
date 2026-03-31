export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID!;
export const TANI_MINT = process.env.NEXT_PUBLIC_TANI_MINT!;
export const USDT_MINT = process.env.NEXT_PUBLIC_USDT_MINT!;
export const SALE_INVENTORY_WALLET = process.env.NEXT_PUBLIC_SALE_INVENTORY_WALLET!;
export const USDT_TREASURY_WALLET = process.env.NEXT_PUBLIC_USDT_TREASURY_WALLET!;
export const TANI_TREASURY_WALLET = process.env.NEXT_PUBLIC_TANI_TREASURY_WALLET!;
export const PLATFORM_CONFIG_PDA = process.env.NEXT_PUBLIC_PLATFORM_CONFIG_PDA!;
export const SALE_AUTHORITY_PDA = process.env.NEXT_PUBLIC_SALE_AUTHORITY_PDA!;

export const PLOT_STATUS_LABEL: Record<string, string> = {
  available: "Available",
  limited: "Limited",
  filled: "Filled",
  paused: "Paused",
  locked: "Locked",
  hidden: "Hidden",
};

export const PLOT_STATUS_COLOR: Record<string, string> = {
  available: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  limited: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  filled: "text-red-400 bg-red-400/10 border-red-400/20",
  paused: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  locked: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  hidden: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export const BLOCK_COLORS: Record<string, string> = {
  A: "#4ADE80",
  B: "#34D399",
  C: "#2DD4BF",
  D: "#38BDF8",
  E: "#818CF8",
  F: "#A78BFA",
};
