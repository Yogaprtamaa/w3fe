"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { fetchPortfolio } from "@/lib/api";
import { Portfolio, PortfolioNft, TokenPurchase } from "@/types";

const BLOCK_COLORS: Record<string, string> = {
  A: "#8CC63F",
  B: "#5EA85E",
  C: "#2DD4BF",
  D: "#38BDF8",
  E: "#818CF8",
  F: "#D4A843",
};

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"nfts" | "history">("nfts");

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);
      fetchPortfolio()
        .then(setPortfolio)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [connected, publicKey]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A1A0C",
        paddingTop: 64,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: 11,
              color: "rgba(140,198,63,0.6)",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Dashboard
          </p>
          <h1
            style={{
              fontFamily: "Syne",
              fontWeight: 900,
              fontSize: 48,
              color: "#E8EED8",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #8CC63F, #5EA85E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Portfolio
            </span>
          </h1>
          <p
            style={{
              color: "#8FA888",
              fontSize: 16,
              fontFamily: "DM Sans",
            }}
          >
            Daftar Plot NFT dan riwayat transaksi kamu di platform Z4.
          </p>
        </div>

        {/* Not Connected */}
        {!connected ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>👛</div>
            <h3
              style={{
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 24,
                color: "#E8EED8",
                marginBottom: 12,
              }}
            >
              Connect Wallet Dulu
            </h3>
            <p
              style={{
                color: "#8FA888",
                fontSize: 15,
                marginBottom: 32,
              }}
            >
              Hubungkan Phantom wallet untuk melihat portfolio kamu.
            </p>
            <button
              onClick={() => setVisible(true)}
              className="btn-primary"
              style={{ fontSize: 15, padding: "14px 32px" }}
            >
              Connect Wallet
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                color: "#8FA888",
                fontFamily: "DM Mono",
              }}
            >
              Memuat portfolio...
            </p>
          </div>
        ) : (
          <div>
            {/* Wallet + Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 16,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 16,
                  padding: 20,
                  gridColumn: "span 2",
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 10,
                    color: "rgba(140,198,63,0.5)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Wallet Aktif
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#8CC63F",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 13,
                      color: "#E8EED8",
                    }}
                  >
                    {publicKey?.toString()}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 10,
                    color: "rgba(140,198,63,0.5)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Total Plot NFT
                </p>
                <p
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 900,
                    fontSize: 36,
                    color: "#8CC63F",
                  }}
                >
                  {portfolio?.total_nfts || 0}
                </p>
              </div>

              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 10,
                    color: "rgba(140,198,63,0.5)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Riwayat Pembelian
                </p>
                <p
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 900,
                    fontSize: 36,
                    color: "#D4A843",
                  }}
                >
                  {portfolio?.purchase_history?.length || 0}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 28,
                borderBottom: "1px solid rgba(140,198,63,0.08)",
                paddingBottom: 0,
              }}
            >
              {[
                {
                  key: "nfts",
                  label: `Plot NFT (${portfolio?.total_nfts || 0})`,
                },
                {
                  key: "history",
                  label: `Riwayat Pembelian (${portfolio?.purchase_history?.length || 0})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "nfts" | "history")}
                  style={{
                    padding: "10px 20px",
                    background: "none",
                    border: "none",
                    borderBottom:
                      activeTab === tab.key
                        ? "2px solid #8CC63F"
                        : "2px solid transparent",
                    color: activeTab === tab.key ? "#8CC63F" : "#8FA888",
                    fontFamily: "Syne",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* NFTs Tab */}
            {activeTab === "nfts" && (
              <div>
                {!portfolio?.nfts?.length ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🌾</div>
                    <h3
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#E8EED8",
                        marginBottom: 8,
                      }}
                    >
                      Belum Ada Plot NFT
                    </h3>
                    <p
                      style={{
                        color: "#8FA888",
                        fontSize: 14,
                        marginBottom: 24,
                      }}
                    >
                      Mulai eksplorasi plot dan lakukan alokasi pertama kamu.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                      }}
                    >
                      <Link href="/get-tani" className="btn-primary">
                        Get $TANI
                      </Link>
                      <Link href="/plots" className="btn-ghost">
                        Eksplorasi Plot
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 20,
                    }}
                  >
                    {portfolio.nfts.map((nft: PortfolioNft) => {
                      const blockColor =
                        BLOCK_COLORS[nft.block_id] || "#8CC63F";
                      return (
                        <div
                          key={nft.nft_id}
                          style={{
                            background: `linear-gradient(135deg, rgba(17,34,20,0.9), rgba(28,51,32,0.6))`,
                            border: `1px solid ${blockColor}25`,
                            borderRadius: 18,
                            padding: 24,
                            transition: "all 0.2s",
                          }}
                        >
                          {/* NFT Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 20,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 12,
                                  background: `${blockColor}20`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 20,
                                }}
                              >
                                🌾
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontFamily: "Syne",
                                    fontWeight: 700,
                                    fontSize: 16,
                                    color: "#E8EED8",
                                  }}
                                >
                                  Plot {nft.plot_id}
                                </p>
                                <p style={{ color: "#8FA888", fontSize: 12 }}>
                                  Block {nft.block_id}
                                </p>
                              </div>
                            </div>
                            <span
                              style={{
                                fontFamily: "DM Mono",
                                fontSize: 10,
                                color: "#10B981",
                                background: "rgba(16,185,129,0.1)",
                                padding: "4px 10px",
                                borderRadius: 20,
                                border: "1px solid rgba(16,185,129,0.2)",
                              }}
                            >
                              {nft.status}
                            </span>
                          </div>

                          {/* NFT Details */}
                          <div style={{ marginBottom: 16 }}>
                            {[
                              {
                                label: "NFT ID",
                                value: nft.nft_id.slice(0, 20) + "...",
                              },
                              { label: "Lokasi", value: nft.location_name },
                              { label: "Tipe", value: nft.asset_type },
                              {
                                label: "$TANI Dipakai",
                                value: `${parseFloat(nft.tani_spent).toLocaleString()} $TANI`,
                              },
                              {
                                label: "Treasury",
                                value: `${parseFloat(nft.treasury_amount).toLocaleString()} $TANI`,
                              },
                              {
                                label: "Burned",
                                value: `${parseFloat(nft.burn_amount).toLocaleString()} $TANI`,
                              },
                            ].map((row) => (
                              <div
                                key={row.label}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "6px 0",
                                  borderBottom:
                                    "1px solid rgba(140,198,63,0.05)",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#8FA888",
                                    fontSize: 12,
                                  }}
                                >
                                  {row.label}
                                </span>
                                <span
                                  style={{
                                    fontFamily: "DM Mono",
                                    fontSize: 11,
                                    color: "#E8EED8",
                                    maxWidth: 160,
                                    textAlign: "right",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {row.value}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Minted at */}
                          <p
                            style={{
                              fontFamily: "DM Mono",
                              fontSize: 10,
                              color: "rgba(143,168,136,0.5)",
                              marginBottom: 14,
                            }}
                          >
                            Minted:{" "}
                            {new Date(nft.minted_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>

                          {/* Legal note */}
                          <div
                            style={{
                              background: "rgba(212,168,67,0.06)",
                              border: "1px solid rgba(212,168,67,0.12)",
                              borderRadius: 8,
                              padding: "8px 12px",
                            }}
                          >
                            <p
                              style={{
                                color: "rgba(212,168,67,0.7)",
                                fontSize: 11,
                                fontFamily: "DM Sans",
                              }}
                            >
                              Allocation Record · {nft.legal_reference_id ||
                                "LEGAL-REF-001"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                {!portfolio?.purchase_history?.length ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                    <h3
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#E8EED8",
                        marginBottom: 8,
                      }}
                    >
                      Belum Ada Riwayat
                    </h3>
                    <p
                      style={{
                        color: "#8FA888",
                        fontSize: 14,
                        marginBottom: 24,
                      }}
                    >
                      Beli $TANI pertama kamu untuk memulai.
                    </p>
                    <Link href="/get-tani" className="btn-primary">
                      Get $TANI
                    </Link>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {portfolio.purchase_history.map(
                      (purchase: TokenPurchase) => (
                        <div
                          key={purchase.purchase_id}
                          style={{
                            background: "rgba(17,34,20,0.7)",
                            border: "1px solid rgba(140,198,63,0.08)",
                            borderRadius: 14,
                            padding: "18px 24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: "rgba(140,198,63,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                              }}
                            >
                              💰
                            </div>
                            <div>
                              <p
                                style={{
                                  fontFamily: "Syne",
                                  fontWeight: 600,
                                  fontSize: 15,
                                  color: "#E8EED8",
                                  marginBottom: 2,
                                }}
                              >
                                Beli $TANI
                              </p>
                              <p
                                style={{
                                  fontFamily: "DM Mono",
                                  fontSize: 11,
                                  color: "#8FA888",
                                }}
                              >
                                {new Date(
                                  purchase.created_at
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div style={{ textAlign: "center" }}>
                            <p
                              style={{
                                fontFamily: "DM Mono",
                                fontSize: 13,
                                color: "#8FA888",
                              }}
                            >
                              {parseFloat(
                                purchase.usdt_amount
                              ).toLocaleString()}{" "}
                              USDT
                            </p>
                            <p style={{ color: "#4A6B4E", fontSize: 12 }}>
                              →
                            </p>
                            <p
                              style={{
                                fontFamily: "DM Mono",
                                fontSize: 13,
                                color: "#8CC63F",
                              }}
                            >
                              {parseFloat(
                                purchase.tani_amount
                              ).toLocaleString()}{" "}
                              $TANI
                            </p>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <span
                              style={{
                                fontFamily: "DM Mono",
                                fontSize: 11,
                                color:
                                  purchase.status === "success"
                                    ? "#10B981"
                                    : "#EF4444",
                                background:
                                  purchase.status === "success"
                                    ? "rgba(16,185,129,0.1)"
                                    : "rgba(239,68,68,0.1)",
                                padding: "4px 10px",
                                borderRadius: 20,
                                border:
                                  purchase.status === "success"
                                    ? "1px solid rgba(16,185,129,0.2)"
                                    : "1px solid rgba(239,68,68,0.2)",
                                display: "block",
                                marginBottom: 6,
                              }}
                            >
                              {purchase.status}
                            </span>
                            {purchase.tx_hash && (
                              <a
                                href={`https://explorer.solana.com/tx/${purchase.tx_hash}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontFamily: "DM Mono",
                                  fontSize: 11,
                                  color: "#8CC63F",
                                  textDecoration: "none",
                                }}
                              >
                                Explorer →
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
