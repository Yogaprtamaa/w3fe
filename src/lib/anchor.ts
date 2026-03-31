import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "./idl/z4_contracts.json";

export const PROGRAM_ID = new PublicKey(
  "8tUz3PDatBckE2FPAmFx4UUDV59SustzdmcwS7sLpbi1"
);
export const TANI_MINT = new PublicKey(
  "82uRtk77equ3QPbRdkzU7Hu5XKWt5ryAB9nGP8djRwSD"
);
export const USDT_MINT = new PublicKey(
  "5rj6AeTJYsHdVDF9DtKDazEtqm6zGe4Yr2orDB9Eydu5"
);
export const PLATFORM_CONFIG_PDA = new PublicKey(
  "2AfPopNzsAHEj5N4mUgdC82L4qSAXBWGDz37nFht4L62"
);
export const SALE_AUTHORITY_PDA = new PublicKey(
  "F3PQ6iEeknDmicX7Q5p8hpukUVHt2MpxZ8TvJj5bs4r2"
);
export const SALE_INVENTORY_TOKEN_ACCOUNT = new PublicKey(
  "3ieAAeYzFoJhbQvSUESqNvzZL19zLkCvxrqzPuWPRNkN"
);
export const USDT_TREASURY_TOKEN_ACCOUNT = new PublicKey(
  "JDxqA2XymPzZM7rRfkmDLUEmfctY98ZqTUS4NSNLmTg3"
);
export const TANI_TREASURY_TOKEN_ACCOUNT = new PublicKey(
  "7C8aQokuce1qyzNzwN6QMV7VW1uPysXH6nHdvNEqzo4"
);

export const RPC_URL = "https://api.devnet.solana.com";

export function getProgram(wallet: AnchorWallet) {
  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl as unknown as Idl, provider);
}
