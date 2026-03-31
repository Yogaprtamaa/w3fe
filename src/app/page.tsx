"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchBlocksSummary } from "@/lib/api";
import { BlockSummary } from "@/types";

export default function HomePage() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [blocks, setBlocks] = useState<BlockSummary[]>([]);

  useEffect(() => {
    fetchBlocksSummary()
      .then((data) => setBlocks(data.blocks || []))
      .catch(() => {});
  }, []);

  const totalPlots = blocks.reduce((a, b) => a + b.total_plots, 0);
  const totalCapacity = blocks.reduce((a, b) => a + b.total_capacity, 0);

  return (
    <main className="min-h-screen bg-soil">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center" style={{
        backgroundImage: `
          linear-gradient(rgba(140,198,63,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(140,198,63,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }}>
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(140,198,63,0.08), transparent 70%)",
            filter: "blur(60px)"
          }}
        />

        <div style={{ 
          width: "100%", 
          maxWidth: 1280, 
          margin: "0 auto", 
          padding: "80px 64px 80px 64px" 
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* Left */}
            <div>
              <div className="glass" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999, marginBottom: 32
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8CC63F" }} />
                <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#8FA888" }}>
                  Solana Devnet — Platform Aktif
                </span>
              </div>

              <h1 style={{
                fontFamily: "Syne", fontWeight: 900, fontSize: 56,
                lineHeight: 1.05, marginBottom: 24, letterSpacing: "-1px"
              }}>
                <span style={{ color: "#E8EED8", display: "block" }}>Alokasi Lahan</span>
                <span className="gradient-text" style={{ display: "block" }}>Pertanian Nyata</span>
                <span style={{
                  color: "#8FA888", fontSize: 36, fontWeight: 600,
                  fontStyle: "italic", display: "block", marginTop: 4
                }}>di Blockchain</span>
              </h1>

              <p style={{
                color: "#8FA888", fontSize: 16, lineHeight: 1.7,
                marginBottom: 32, maxWidth: 460, fontFamily: "DM Sans"
              }}>
                Z4 menghubungkan aset lahan pertanian fisik yang telah dipetakan
                dengan sistem alokasi digital. Tercatat permanen dan transparan
                di Solana blockchain.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
                {["USDT", "$TANI", "Plot NFT"].map((item, i) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="glass" style={{ padding: "6px 16px", borderRadius: 8 }}>
                      <span style={{ fontFamily: "DM Mono", fontSize: 13, color: "#8CC63F", fontWeight: 500 }}>
                        {item}
                      </span>
                    </div>
                    {i < 2 && <span style={{ color: "#4A6B4E", fontSize: 18 }}>→</span>}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <Link href="/get-tani" className="btn-primary">
                  Get $TANI
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/plots" className="btn-ghost">
                  Eksplorasi Plot
                </Link>
              </div>
            </div>

            {/* Right — Card */}
            <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <p style={{ fontFamily: "DM Mono", fontSize: 10, color: "#4A6B4E", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
                    Platform Overview
                  </p>
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, color: "#E8EED8" }}>
                    Rantau Harapan
                  </h3>
                  <p style={{ color: "#8FA888", fontSize: 13 }}>Banyuasin, Sumatera Selatan</p>
                </div>
                <div className="glass" style={{ padding: "4px 12px", borderRadius: 8 }}>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "#8CC63F" }}>On-Chain ✓</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Total Blok", value: "6", sub: "Block A–F" },
                  { label: "Total Plot", value: String(totalPlots || 60), sub: "Terdaftar" },
                  { label: "Tersedia", value: String(totalPlots || 60), sub: "Plot aktif" },
                  { label: "Total Kapasitas", value: totalCapacity ? `${(totalCapacity/1000).toFixed(0)}K` : "30K", sub: "Unit alokasi" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: "rgba(28,51,32,0.5)", borderRadius: 12,
                    padding: "14px 16px"
                  }}>
                    <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 26, color: "#8CC63F" }}>{stat.value}</p>
                    <p style={{ color: "#E8EED8", fontSize: 13, fontWeight: 500 }}>{stat.label}</p>
                    <p style={{ color: "#8FA888", fontSize: 11 }}>{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Block list */}
              <div>
                {(blocks.length > 0 ? blocks : "ABCDEF".split("").map(id => ({
                  block_id: id, available: 10, total_plots: 10,
                  limited: 0, filled: 0, total_remaining: 5000, total_capacity: 5000
                }))).map((block, i) => (
                  <div key={block.block_id} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "10px 0",
                    borderBottom: i < 5 ? "1px solid rgba(140,198,63,0.06)" : "none"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "rgba(140,198,63,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 12, color: "#8CC63F" }}>
                          {block.block_id}
                        </span>
                      </div>
                      <span style={{ color: "#E8EED8", fontSize: 14 }}>Block {block.block_id}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#8FA888" }}>
                        {block.available}/{block.total_plots} tersedia
                      </span>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#8CC63F" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "96px 0", borderTop: "1px solid rgba(140,198,63,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(140,198,63,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
              Cara Kerja
            </p>
            <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 40, color: "#E8EED8" }}>
              Empat langkah <span className="gradient-text">kepemilikan</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { num: "01", title: "Connect Wallet", desc: "Hubungkan Phantom wallet kamu ke platform Z4." },
              { num: "02", title: "Get $TANI", desc: "Beli $TANI menggunakan USDT. Token langsung masuk ke wallet." },
              { num: "03", title: "Pilih Plot", desc: "Jelajahi Plot Explorer. Pilih lahan dari Block A hingga F." },
              { num: "04", title: "Convert ke NFT", desc: "Tukar $TANI jadi Plot NFT. Alokasi tercatat permanen on-chain." },
            ].map((step) => (
              <div key={step.num} className="glass" style={{ borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(140,198,63,0.5)" }}>{step.num}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(140,198,63,0.1)" }} />
                </div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "#E8EED8", marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ color: "#8FA888", fontSize: 13, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Z4 ── */}
      <section style={{ padding: "96px 0", borderTop: "1px solid rgba(140,198,63,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(140,198,63,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
                Keunggulan Platform
              </p>
              <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 40, color: "#E8EED8", marginBottom: 16 }}>
                Mengapa <span className="gradient-text">Z4?</span>
              </h2>
              <p style={{ color: "#8FA888", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                Infrastruktur digital yang serius untuk alokasi partisipasi aset riil — bukan proyek crypto spekulatif.
              </p>
              <Link href="/plots" className="btn-primary">
                Lihat Semua Plot
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { title: "Aset Riil", desc: "Setiap plot terhubung ke lahan pertanian fisik yang telah dipetakan secara geografis." },
                { title: "On-Chain Ownership", desc: "Alokasi tercatat permanen di Solana. Tidak bisa dimanipulasi siapapun." },
                { title: "Transparan Penuh", desc: "Semua transaksi dapat diverifikasi publik di Solana Explorer kapan saja." },
                { title: "Struktur Legal Jelas", desc: "Plot NFT adalah Allocation Record yang terikat ke dokumen legal platform." },
                { title: "Cepat & Efisien", desc: "Transaksi Solana selesai dalam detik dengan biaya gas yang minimal." },
                { title: "Plot Registry", desc: "Source of truth tunggal untuk semua data plot, kapasitas, dan status." },
              ].map((item) => (
                <div key={item.title} className="glass" style={{ borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "#E8EED8", marginBottom: 6 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#8FA888", fontSize: 12, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "96px 0", borderTop: "1px solid rgba(140,198,63,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px" }}>
          <div className="glass" style={{
            borderRadius: 24, padding: "64px 48px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(17,34,20,0.8), rgba(28,51,32,0.6))",
            border: "1px solid rgba(140,198,63,0.15)"
          }}>
            <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(140,198,63,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              Mulai Sekarang
            </p>
            <h2 style={{ fontFamily: "Syne", fontWeight: 900, fontSize: 44, color: "#E8EED8", marginBottom: 16 }}>
              Siap mengalokasikan{" "}
              <span className="gradient-text">lahan pertanian</span>?
            </h2>
            <p style={{ color: "#8FA888", fontSize: 16, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              Connect wallet dan mulai eksplorasi plot yang tersedia hari ini.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              {connected ? (
                <Link href="/get-tani" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
                  Get $TANI Sekarang
                </Link>
              ) : (
                <button onClick={() => setVisible(true)} className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
                  Connect Wallet
                </button>
              )}
              <Link href="/plots" className="btn-ghost" style={{ fontSize: 15, padding: "14px 32px" }}>
                Eksplorasi Plot
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(140,198,63,0.08)", padding: "32px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#8CC63F", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Syne", fontWeight: 900, color: "#0A1A0C", fontSize: 11 }}>Z4</span>
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 700, color: "#8FA888", fontSize: 14 }}>Z4 Platform</span>
          </div>
          <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(143,168,136,0.5)", textAlign: "center" }}>
            Plot NFT adalah Allocation Record — bukan sertifikat hak milik tanah.
          </p>
          <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "rgba(143,168,136,0.4)" }}>
            Solana Devnet · V1.0
          </p>
        </div>
      </footer>
    </main>
  );
}