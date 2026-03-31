import type { Metadata } from "next";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/wallet/WalletProvider";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Z4 — Digital Infrastructure for Structured Land Allocation",
  description: "Platform digital alokasi partisipasi pada lahan pertanian nyata.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <SolanaWalletProvider>
          <Navbar />
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
