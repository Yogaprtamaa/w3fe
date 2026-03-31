"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import {
  fetchPlotById,
  fetchAllocationPreview,
  createAllocation,
  loginWallet,
} from "@/lib/api";
import { Plot, AllocationPreview } from "@/types";
import {
  getProgram,
  TANI_MINT,
  PLATFORM_CONFIG_PDA,
  TANI_TREASURY_TOKEN_ACCOUNT,
} from "@/lib/anchor";

const BLOCK_COLORS: Record<string, string> = {
  A: "#8CC63F",
  B: "#5EA85E",
  C: "#2DD4BF",
  D: "#38BDF8",
  E: "#818CF8",
  F: "#D4A843",
};

export default function AllocatePage() {
  const params = useParams();
  const { connected, publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const plotId = (params.plot_id as string).toUpperCase();

  const [plot, setPlot] = useState<Plot | null>(null);
  const [preview, setPreview] = useState<AllocationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [nftId, setNftId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchPlotById(plotId),
      connected ? fetchAllocationPreview(plotId) : Promise.resolve(null),
    ])
      .then(([plotData, previewData]) => {
        setPlot(plotData);
        setPreview(previewData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [plotId, connected]);

  const handleAllocate = async () => {
    if (!anchorWallet || !publicKey || !plot || !preview) return;
    setTxLoading(true);
    setError("");

    try {
      // Re-login untuk pastikan token valid
      const authRes = await loginWallet(publicKey.toString());
      localStorage.setItem("z4_token", authRes.token);

      const program = getProgram(anchorWallet);

      // Token accounts
      const userTaniAccount = await getAssociatedTokenAddress(
        TANI_MINT,
        publicKey
      );

      // TANI amount dalam lamports (9 desimal)
      const taniLamports = new BN(
        Math.floor(parseFloat(preview.tani_required) * 1_000_000_000)
      );

      // Generate NFT ID
      const generatedNftId = `Z4-PLOT-${plotId}-${Date.now()}`;
      setNftId(generatedNftId);

      // Panggil contract allocate_plot
      const tx = await program.methods
        .allocatePlot(plotId, generatedNftId, taniLamports)
        .accounts({
          platformConfig: PLATFORM_CONFIG_PDA,
          user: publicKey,
          userTaniAccount,
          taniTreasury: TANI_TREASURY_TOKEN_ACCOUNT,
          taniMint: TANI_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("TX:", tx);
      setTxHash(tx);

      // Catat ke backend
      await createAllocation(plotId, 1, tx);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Transaksi gagal. Coba lagi.";
      setError(message);
    } finally {
      setTxLoading(false);
    }
  };

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
        <p style={{ color: "#8FA888", fontFamily: "DM Mono" }}>Memuat...</p>
      </main>
    );

  const blockColor = plot ? BLOCK_COLORS[plot.block_id] : "#8CC63F";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0A1A0C",
        paddingTop: 64,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 32px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
          }}
        >
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
          <Link
            href={`/plots/${plotId}`}
            style={{
              fontFamily: "DM Mono",
              fontSize: 12,
              color: "#8FA888",
              textDecoration: "none",
            }}
          >
            Plot {plotId}
          </Link>
          <span style={{ color: "#4A6B4E" }}>→</span>
          <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#8CC63F" }}>
            Alokasi
          </span>
        </div>

        {success ? (
          /* Success State */
          <div
            style={{
              background: "rgba(17,34,20,0.7)",
              border: "1px solid rgba(140,198,63,0.3)",
              borderRadius: 24,
              padding: 48,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
            <h2
              style={{
                fontFamily: "Syne",
                fontWeight: 900,
                fontSize: 28,
                color: "#E8EED8",
                marginBottom: 8,
              }}
            >
              Alokasi Berhasil!
            </h2>
            <p style={{ color: "#8FA888", fontSize: 15, marginBottom: 24 }}>
              Plot NFT kamu sudah tercatat di blockchain Solana.
            </p>

            {/* NFT Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${blockColor}15, rgba(28,51,32,0.6))`,
                border: `1px solid ${blockColor}30`,
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 10,
                  color: "rgba(140,198,63,0.6)",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Plot NFT — Allocation Record
              </p>
              {[
                { label: "NFT ID", value: nftId },
                {
                  label: "Plot",
                  value: `${plot?.plot_id} — Block ${plot?.block_id}`,
                },
                { label: "Lokasi", value: plot?.location_name || "" },
                { label: "Tipe Aset", value: plot?.asset_type || "" },
                {
                  label: "TANI Dipakai",
                  value: `${parseFloat(preview?.tani_required || "0").toLocaleString()} $TANI`,
                },
                {
                  label: "Treasury (70%)",
                  value: `${parseFloat(preview?.treasury_amount || "0").toLocaleString()} $TANI`,
                },
                {
                  label: "Burned (30%)",
                  value: `${parseFloat(preview?.burn_amount || "0").toLocaleString()} $TANI`,
                },
                {
                  label: "Legal Ref",
                  value: plot?.legal_reference_id || "LEGAL-REF-001",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(140,198,63,0.06)",
                  }}
                >
                  <span style={{ color: "#8FA888", fontSize: 13 }}>
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 12,
                      color: "#E8EED8",
                      maxWidth: 300,
                      textAlign: "right",
                      wordBreak: "break-all",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* TX Link */}
            {txHash && (
              <div style={{ marginBottom: 24 }}>
                <a
                  href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 12,
                    color: "#8CC63F",
                    textDecoration: "none",
                  }}
                >
                  Lihat Transaksi di Solana Explorer →
                </a>
              </div>
            )}

            {/* Legal disclaimer */}
            <div
              style={{
                background: "rgba(212,168,67,0.06)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: 10,
                padding: 14,
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  color: "rgba(212,168,67,0.8)",
                  fontSize: 12,
                  fontFamily: "DM Sans",
                  lineHeight: 1.6,
                }}
              >
                Plot NFT ini adalah <strong>Allocation Record</strong> — bukan
                sertifikat hak milik tanah atau SHM.
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link
                href="/portfolio"
                className="btn-primary"
                style={{ fontSize: 14 }}
              >
                Lihat Portfolio →
              </Link>
              <Link
                href="/plots"
                className="btn-ghost"
                style={{ fontSize: 14 }}
              >
                Eksplorasi Plot Lain
              </Link>
            </div>
          </div>
        ) : (
          /* Allocation Form */
          <div>
            <div style={{ marginBottom: 32 }}>
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
                Allocation Flow
              </p>
              <h1
                style={{
                  fontFamily: "Syne",
                  fontWeight: 900,
                  fontSize: 40,
                  color: "#E8EED8",
                  marginBottom: 8,
                }}
              >
                Convert ke{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #8CC63F, #5EA85E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Plot NFT
                </span>
              </h1>
              <p
                style={{
                  color: "#8FA888",
                  fontSize: 15,
                  fontFamily: "DM Sans",
                }}
              >
                Tukar $TANI kamu menjadi Plot NFT untuk Plot {plotId}.
              </p>
            </div>

            {/* Plot Summary */}
            {plot && (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
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
                        fontSize: 16,
                        color: blockColor,
                      }}
                    >
                      {plot.plot_id}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#E8EED8",
                      }}
                    >
                      Plot {plot.plot_id}
                    </p>
                    <p style={{ color: "#8FA888", fontSize: 13 }}>
                      Block {plot.block_id} · {plot.location_name}
                    </p>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <p
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 20,
                        color: "#8CC63F",
                        fontWeight: 500,
                      }}
                    >
                      {parseFloat(plot.price_in_tani).toLocaleString()}
                    </p>
                    <p
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 11,
                        color: "#8FA888",
                      }}
                    >
                      $TANI / unit
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Routing Preview */}
            {preview && (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 16,
                  padding: 24,
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
                  Routing Token
                </p>

                {[
                  {
                    label: "Total $TANI dipakai",
                    value: `${parseFloat(preview.tani_required).toLocaleString()} $TANI`,
                    color: "#E8EED8",
                  },
                  {
                    label: `→ Treasury (${preview.treasury_percentage}%)`,
                    value: `${parseFloat(preview.treasury_amount).toLocaleString()} $TANI`,
                    color: "#8CC63F",
                  },
                  {
                    label: `→ Burn valid (${preview.burn_percentage}%)`,
                    value: `${parseFloat(preview.burn_amount).toLocaleString()} $TANI`,
                    color: "#EF4444",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(140,198,63,0.06)",
                    }}
                  >
                    <span style={{ color: "#8FA888", fontSize: 14 }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 14,
                        color: row.color,
                        fontWeight: 500,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}

                {/* Visual bar */}
                <div style={{ marginTop: 16 }}>
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
                      70% ke TANI Treasury
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 11,
                        color: "#EF4444",
                      }}
                    >
                      30% di-burn on-chain
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* What you get */}
            <div
              style={{
                background: "rgba(140,198,63,0.05)",
                border: "1px solid rgba(140,198,63,0.15)",
                borderRadius: 16,
                padding: 24,
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
                  marginBottom: 16,
                }}
              >
                Kamu Mendapat
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
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
                    Plot NFT — {plotId}
                  </p>
                  <p style={{ color: "#8FA888", fontSize: 13 }}>
                    Allocation Record · Rantau Harapan, Banyuasin
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "#8CC63F",
                      marginTop: 4,
                    }}
                  >
                    Tercatat permanen di Solana blockchain
                  </p>
                </div>
              </div>
            </div>

            {/* Legal note */}
            <div
              style={{
                background: "rgba(212,168,67,0.06)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  color: "rgba(212,168,67,0.8)",
                  fontSize: 12,
                  fontFamily: "DM Sans",
                  lineHeight: 1.6,
                }}
              >
                <strong>Penting:</strong> Plot NFT adalah Allocation Record,
                bukan sertifikat hak milik tanah atau SHM. Dengan melanjutkan,
                kamu menyetujui ketentuan platform Z4.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    color: "#EF4444",
                    fontSize: 13,
                    fontFamily: "DM Sans",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* CTA */}
            {!connected ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#8FA888", fontSize: 14, marginBottom: 16 }}>
                  Connect wallet untuk melanjutkan
                </p>
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={handleAllocate}
                disabled={txLoading || !preview}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: 16,
                  padding: "16px",
                  opacity: txLoading ? 0.7 : 1,
                }}
              >
                {txLoading
                  ? "Menunggu konfirmasi Phantom..."
                  : "Authorize Transaction →"}
              </button>
            )}

            <p
              style={{
                fontFamily: "DM Mono",
                fontSize: 11,
                color: "rgba(143,168,136,0.4)",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Transaksi diproses di Solana Devnet · Biaya gas minimal
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
