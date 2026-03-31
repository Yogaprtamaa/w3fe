"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/get-tani", label: "Get $TANI" },
  { href: "/plots", label: "Plot Explorer" },
  { href: "/portfolio", label: "Portfolio" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shortAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : null;

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 50,
      background: scrolled ? "rgba(17,34,20,0.85)" : "rgba(10,26,12,0.6)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: scrolled ? "1px solid rgba(140,198,63,0.1)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 64px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32,
            background: "#8CC63F",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "Syne", fontWeight: 900, color: "#0A1A0C", fontSize: 13 }}>Z4</span>
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#E8EED8", fontSize: 16 }}>Z4</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "DM Sans",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
                color: pathname === link.href ? "#8CC63F" : "#8FA888",
                background: pathname === link.href ? "rgba(140,198,63,0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {connected && shortAddress ? (
            <>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(17,34,20,0.7)",
                border: "1px solid rgba(140,198,63,0.15)",
                padding: "6px 14px", borderRadius: 8,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8CC63F" }} />
                <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#8FA888" }}>{shortAddress}</span>
              </div>
              <button onClick={() => disconnect()} className="btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }}>
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={() => setVisible(true)} className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}