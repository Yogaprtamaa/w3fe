"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchPlotById, fetchAllocationPreview } from "@/lib/api";
import { Plot, AllocationPreview } from "@/types";

const BLOCK_COLORS: Record<string, string> = {
  A: "#8CC63F",
  B: "#5EA85E",
  C: "#2DD4BF",
  D: "#38BDF8",
  E: "#818CF8",
  F: "#D4A843",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  available: {
    label: "Available",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
  },
  limited: {
    label: "Limited",
    color: "#D4A843",
    bg: "rgba(212,168,67,0.1)",
  },
  filled: { label: "Filled", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  paused: { label: "Paused", color: "#8FA888", bg: "rgba(143,168,136,0.1)" },
  locked: { label: "Locked", color: "#8FA888", bg: "rgba(143,168,136,0.1)" },
};

export default function PlotDetailPage() {
  const params = useParams();
  const { connected } = useWallet();
  const plotId = (params.plot_id as string).toUpperCase();

  const [plot, setPlot] = useState<Plot | null>(null);
  const [preview, setPreview] = useState<AllocationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlotById(plotId)
      .then((data) => {
        setPlot(data);
        setLoading(false);
        if (
          connected &&
          (data.status === "available" || data.status === "limited")
        ) {
          fetchAllocationPreview(plotId)
            .then(setPreview)
            .catch(() => {});
        }
      })
      .catch(() => {
        setError("Plot tidak ditemukan");
        setLoading(false);
      });
  }, [plotId, connected]);

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0A1A0C",
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#8FA888", fontFamily: "DM Mono" }}>
          Memuat data plot...
        </p>
      </main>
    );

  if (error || !plot)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0A1A0C",
          paddingTop: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#EF4444", fontFamily: "DM Mono", marginBottom: 16 }}>
            Plot tidak ditemukan
          </p>
          <Link href="/plots" className="btn-ghost">
            ← Kembali ke Explorer
          </Link>
        </div>
      </main>
    );

  const blockColor = BLOCK_COLORS[plot.block_id];
  const statusCfg = STATUS_CONFIG[plot.status] || STATUS_CONFIG.available;
  const isAvailable =
    plot.status === "available" || plot.status === "limited";
  const fillPct = plot.fill_percentage ?? 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A1A0C",
        paddingTop: 64,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 64px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
          <Link
            href="/plots"
            style={{
              fontFamily: "DM Mono",
              fontSize: 12,
              color: "#8FA888",
              textDecoration: "none",
            }}
          >
            Plot Explorer
          </Link>
          <span style={{ color: "#4A6B4E" }}>→</span>
          <span
            style={{
              fontFamily: "DM Mono",
              fontSize: 12,
              color: "#8CC63F",
            }}
          >
            Block {plot.block_id} / {plot.plot_id}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Left — Detail */}
          <div>
            {/* Plot Header */}
            <div
              style={{
                background: "rgba(17,34,20,0.7)",
                border: "1px solid rgba(140,198,63,0.1)",
                borderRadius: 20,
                padding: 32,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `${blockColor}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 900,
                        fontSize: 20,
                        color: blockColor,
                      }}
                    >
                      {plot.plot_id}
                    </span>
                  </div>
                  <div>
                    <h1
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 900,
                        fontSize: 32,
                        color: "#E8EED8",
                        marginBottom: 4,
                      }}
                    >
                      Plot {plot.plot_id}
                    </h1>
                    <p style={{ color: "#8FA888", fontSize: 14 }}>
                      Block {plot.block_id} · {plot.location_name}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 12,
                    fontWeight: 500,
                    color: statusCfg.color,
                    background: statusCfg.bg,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${statusCfg.color}30`,
                  }}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Tipe Aset", value: plot.asset_type },
                  { label: "Total Luas", value: `${plot.total_area} Ha` },
                  { label: "Lokasi", value: "Banyuasin, Sumsel" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "rgba(28,51,32,0.4)",
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 10,
                        color: "#8FA888",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      {item.label}
                    </p>
                    <p style={{ color: "#E8EED8", fontSize: 14, fontWeight: 500 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Capacity */}
              <div
                style={{
                  background: "rgba(28,51,32,0.4)",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "#8FA888",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    Kapasitas Alokasi
                  </p>
                  <p style={{ fontFamily: "DM Mono", fontSize: 13, color: "#E8EED8" }}>
                    <span style={{ color: blockColor }}>
                      {plot.remaining_capacity.toLocaleString()}
                    </span>
                    {" / "}{plot.total_allocation_capacity.toLocaleString()} unit
                  </p>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(140,198,63,0.1)",
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      background:
                        fillPct > 80
                          ? "#EF4444"
                          : fillPct > 50
                            ? "#D4A843"
                            : blockColor,
                      width: `${100 - fillPct}%`,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "#8FA888" }}>
                    {plot.allocated_capacity} unit terisi
                  </span>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "#8FA888" }}>
                    {fillPct.toFixed(1)}% terisi
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div
              style={{
                background: "rgba(17,34,20,0.7)",
                border: "1px solid rgba(140,198,63,0.1)",
                borderRadius: 20,
                padding: 32,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 11,
                  color: "rgba(140,198,63,0.6)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Harga Alokasi
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 900,
                    fontSize: 40,
                    color: "#8CC63F",
                  }}
                >
                  {parseFloat(plot.price_in_tani).toLocaleString()}
                </span>
                <span style={{ fontFamily: "DM Mono", fontSize: 16, color: "#8FA888" }}>
                  $TANI / unit
                </span>
              </div>
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 14,
                  color: "#8FA888",
                  marginBottom: 4,
                }}
              >
                ≈ {parseFloat(plot.price_in_usdt_reference || "0").toLocaleString()} USDT
                <span
                  style={{
                    fontSize: 11,
                    marginLeft: 8,
                    color: "#4A6B4E",
                  }}
                >
                  (estimasi, dapat berubah)
                </span>
              </p>
            </div>

            {/* Legal Note */}
            <div
              style={{
                background: "rgba(212,168,67,0.06)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: 14,
                padding: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 11,
                  color: "#D4A843",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Catatan Legal
              </p>
              <p
                style={{
                  color: "rgba(212,168,67,0.8)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  fontFamily: "DM Sans",
                }}
              >
                Plot NFT adalah <strong>Allocation Record</strong> — catatan digital
                partisipasi/alokasi yang terikat ke plot ini dalam sistem Z4. Plot
                NFT bukan sertifikat hak milik tanah, bukan SHM, dan tidak
                merepresentasikan kepemilikan legal atas lahan.
              </p>
              {plot.legal_reference_id && (
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 11,
                    color: "#D4A843",
                    marginTop: 8,
                  }}
                >
                  Ref: {plot.legal_reference_id}
                </p>
              )}
            </div>
          </div>

          {/* Right — Allocation Panel */}
          <div style={{ position: "sticky", top: 84 }}>
            <div
              style={{
                background: "rgba(17,34,20,0.7)",
                border: `1px solid ${
                  isAvailable ? "rgba(140,198,63,0.2)" : "rgba(140,198,63,0.08)"
                }`,
                borderRadius: 20,
                padding: 28,
              }}
            >
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 11,
                  color: "rgba(140,198,63,0.6)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Allocation Panel
              </p>

              {!isAvailable ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>🔒</p>
                  <p
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#E8EED8",
                      marginBottom: 8,
                    }}
                  >
                    Plot Tidak Tersedia
                  </p>
                  <p style={{ color: "#8FA888", fontSize: 13 }}>
                    Status: {statusCfg.label}
                  </p>
                </div>
              ) : !connected ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ fontSize: 32, marginBottom: 12 }}>👛</p>
                  <p
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#E8EED8",
                      marginBottom: 8,
                    }}
                  >
                    Connect Wallet
                  </p>
                  <p style={{ color: "#8FA888", fontSize: 13, marginBottom: 20 }}>
                    Hubungkan wallet untuk melihat detail alokasi.
                  </p>
                  <Link
                    href="/get-tani"
                    className="btn-primary"
                    style={{
                      fontSize: 14,
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    Get $TANI Dulu
                  </Link>
                </div>
              ) : preview ? (
                <div>
                  {/* Preview routing 70/30 */}
                  <div style={{ marginBottom: 20 }}>
                    {[
                      {
                        label: "Total $TANI",
                        value: `${parseFloat(preview.tani_required).toLocaleString()} $TANI`,
                        color: "#E8EED8",
                      },
                      {
                        label: `Treasury (${preview.treasury_percentage}%)`,
                        value: `${parseFloat(preview.treasury_amount).toLocaleString()} $TANI`,
                        color: "#8CC63F",
                      },
                      {
                        label: `Burn (${preview.burn_percentage}%)`,
                        value: `${parseFloat(preview.burn_amount).toLocaleString()} $TANI`,
                        color: "#EF4444",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: "1px solid rgba(140,198,63,0.06)",
                        }}
                      >
                        <span style={{ color: "#8FA888", fontSize: 13 }}>
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "DM Mono",
                            fontSize: 13,
                            color: row.color,
                          }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Visual 70/30 */}
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 4,
                        overflow: "hidden",
                        display: "flex",
                      }}
                    >
                      <div style={{ width: "70%", background: "#8CC63F" }} />
                      <div style={{ width: "30%", background: "#EF4444" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: 11,
                          color: "#8CC63F",
                        }}
                      >
                        70% Treasury
                      </span>
                      <span
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: 11,
                          color: "#EF4444",
                        }}
                      >
                        30% Burn
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/plots/${plot.plot_id}/allocate`}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      fontSize: 15,
                      padding: "14px",
                    }}
                  >
                    Convert to Plot NFT →
                  </Link>

                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "rgba(143,168,136,0.4)",
                      textAlign: "center",
                      marginTop: 12,
                    }}
                  >
                    Transaksi diproses di Solana Devnet
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: "#8FA888", fontFamily: "DM Mono", fontSize: 13 }}>
                    Memuat preview...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
