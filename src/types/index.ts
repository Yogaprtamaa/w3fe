export interface Plot {
  plot_id: string;
  block_id: string;
  location_name: string;
  asset_type: string;
  total_area: string;
  total_allocation_capacity: number;
  allocated_capacity: number;
  remaining_capacity: number;
  price_in_tani: string;
  price_in_usdt_reference: string;
  status: "available" | "limited" | "filled" | "paused" | "locked" | "hidden";
  legal_reference_id: string | null;
  metadata_uri: string | null;
  created_at: string;
  updated_at: string;
  fill_percentage: number;
}

export interface BlockSummary {
  block_id: string;
  total_plots: number;
  available: number;
  limited: number;
  filled: number;
  total_remaining: number;
  total_capacity: number;
}

export interface TokenPurchase {
  purchase_id: string;
  wallet_address: string;
  usdt_amount: string;
  tani_amount: string;
  rate_used: string;
  tx_hash: string | null;
  status: "pending" | "success" | "failed";
  created_at: string;
}

export interface Allocation {
  allocation_id: string;
  wallet_address: string;
  plot_id: string;
  allocation_quantity: number;
  tani_spent: string;
  treasury_amount: string;
  burn_amount: string;
  nft_id: string | null;
  tx_hash: string | null;
  status: "pending" | "success" | "failed";
  created_at: string;
}

export interface AllocationPreview {
  plot_id: string;
  allocation_quantity: number;
  tani_required: string;
  treasury_amount: string;
  burn_amount: string;
  treasury_percentage: number;
  burn_percentage: number;
}

export interface PortfolioNft {
  nft_id: string;
  plot_id: string;
  block_id: string;
  location_name: string;
  asset_type: string;
  tani_spent: string;
  treasury_amount: string;
  burn_amount: string;
  status: string;
  minted_at: string;
  legal_reference_id: string | null;
}

export interface Portfolio {
  wallet_address: string;
  total_nfts: number;
  nfts: PortfolioNft[];
  purchase_history: TokenPurchase[];
}

export interface AuthResponse {
  token: string;
  user_id: string;
  wallet_address: string;
}
