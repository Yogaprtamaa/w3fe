"use client";

import { useState, useEffect } from "react";
import {
  useWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { fetchTokenSalePreview, buyTani, loginWallet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  getProgram,
  TANI_MINT,
  USDT_MINT,
  PLATFORM_CONFIG_PDA,
  SALE_AUTHORITY_PDA,
  SALE_INVENTORY_TOKEN_ACCOUNT,
  USDT_TREASURY_TOKEN_ACCOUNT,
} from "@/lib/anchor";

export default function GetTaniPage() {
  const { connected, publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { token } = useAuth();

  const [usdtAmount, setUsdtAmount] = useState("");
  const [rate, setRate] = useState(10);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (connected) {
      fetchTokenSalePreview()
        .then((data) => setRate(data.rate_tani_per_usdt))
        .catch(() => {});
    }
  }, [connected]);

  const taniEstimate = usdtAmount ? parseFloat(usdtAmount) * rate : 0;

  const handleBuy = async () => {
    if (!anchorWallet || !publicKey || !usdtAmount) return;
    setLoading(true);
    setError("");

    try {
      // Ensure token is fresh before transaction
      const authRes = await loginWallet(publicKey.toString());
      localStorage.setItem("z4_token", authRes.token);
      localStorage.setItem("z4_wallet", authRes.wallet_address);

      const program = getProgram(anchorWallet);

      // Get token accounts
      const buyerUsdtAccount = await getAssociatedTokenAddress(
        USDT_MINT,
        publicKey
      );
      const buyerTaniAccount = await getAssociatedTokenAddress(
        TANI_MINT,
        publicKey
      );

      // Convert USDT to lamports (6 decimals)
      const usdtLamports = new BN(parseFloat(usdtAmount) * 1_000_000);

      // Call contract buyTani
      const tx = await program.methods
        .buyTani(usdtLamports)
        .accounts({
          platformConfig: PLATFORM_CONFIG_PDA,
          buyer: publicKey,
          buyerUsdtAccount,
          buyerTaniAccount,
          usdtTreasury: USDT_TREASURY_TOKEN_ACCOUNT,
          saleInventory: SALE_INVENTORY_TOKEN_ACCOUNT,
          saleAuthority: SALE_AUTHORITY_PDA,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("TX:", tx);
      setTxHash(tx);

      // Record to backend with fresh token
      const storedToken = localStorage.getItem("z4_token");
      if (storedToken) {
        await buyTani(usdtAmount, tx);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Transaksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0A1A0C", paddingTop: 64 }}>
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
            Token Sale
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
            Get{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8CC63F, #5EA85E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $TANI
            </span>
          </h1>
          <p style={{ color: "#8FA888", fontSize: 16, fontFamily: "DM Sans" }}>
            Beli $TANI menggunakan USDT. Token langsung masuk ke wallet kamu.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Left — Form */}
          <div>
            {!connected ? (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.12)",
                  borderRadius: 20,
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>👛</div>
                <h3
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#E8EED8",
                    marginBottom: 8,
                  }}
                >
                  Connect Wallet Dulu
                </h3>
                <p
                  style={{
                    color: "#8FA888",
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  Hubungkan Phantom wallet untuk mulai beli $TANI.
                </p>
                <button
                  onClick={() => setVisible(true)}
                  className="btn-primary"
                >
                  Connect Wallet
                </button>
              </div>
            ) : success ? (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.3)",
                  borderRadius: 20,
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#E8EED8",
                    marginBottom: 8,
                  }}
                >
                  Pembelian Berhasil!
                </h3>
                <p
                  style={{
                    color: "#8FA888",
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  {taniEstimate.toLocaleString()} $TANI sudah masuk ke wallet kamu.
                </p>

                {/* TX Hash */}
                {txHash && (
                  <div
                    style={{
                      background: "rgba(28,51,32,0.5)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      marginBottom: 20,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 11,
                        color: "rgba(140,198,63,0.6)",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Transaction Hash
                    </p>
                    <p
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 12,
                        color: "#E8EED8",
                        wordBreak: "break-all",
                        marginBottom: 10,
                      }}
                    >
                      {txHash.slice(0, 20)}...{txHash.slice(-10)}
                    </p>
                    <a
                      href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        fontSize: 13,
                        padding: "8px 20px",
                        display: "inline-flex",
                      }}
                    >
                      Lihat di Solana Explorer →
                    </a>
                  </div>
                )}

                {/* Summary */}
                <div
                  style={{
                    background: "rgba(28,51,32,0.3)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    marginBottom: 20,
                    textAlign: "left",
                  }}
                >
                  {[
                    { label: "Dibayar", value: `${usdtAmount} USDT` },
                    {
                      label: "Diterima",
                      value: `${taniEstimate.toLocaleString()} $TANI`,
                    },
                    { label: "Rate", value: `1 USDT = ${rate} $TANI` },
                    { label: "Network", value: "Solana Devnet" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "1px solid rgba(140,198,63,0.06)",
                      }}
                    >
                      <span
                        style={{
                          color: "#8FA888",
                          fontSize: 13,
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: 13,
                          color: "#E8EED8",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setUsdtAmount("");
                      setTxHash("");
                    }}
                    className="btn-ghost"
                  >
                    Beli Lagi
                  </button>
                  <a
                    href="/plots"
                    className="btn-primary"
                    style={{ fontSize: 14 }}
                  >
                    Eksplorasi Plot →
                  </a>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.12)",
                  borderRadius: 20,
                  padding: 32,
                }}
              >
                <h3
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#E8EED8",
                    marginBottom: 24,
                  }}
                >
                  Beli $TANI
                </h3>

                {/* USDT Input */}
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "#8FA888",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Jumlah USDT
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={usdtAmount}
                      onChange={(e) => setUsdtAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "14px 60px 14px 16px",
                        background: "rgba(28,51,32,0.5)",
                        border: "1px solid rgba(140,198,63,0.15)",
                        borderRadius: 10,
                        color: "#E8EED8",
                        fontFamily: "DM Mono",
                        fontSize: 20,
                        outline: "none",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "DM Mono",
                        fontSize: 13,
                        color: "#8FA888",
                      }}
                    >
                      USDT
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    textAlign: "center",
                    margin: "16px 0",
                    color: "#4A6B4E",
                    fontSize: 20,
                  }}
                >
                  ↓
                </div>

                {/* TANI Output */}
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "#8FA888",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Estimasi $TANI Diterima
                  </label>
                  <div
                    style={{
                      padding: "14px 16px",
                      background: "rgba(140,198,63,0.06)",
                      border: "1px solid rgba(140,198,63,0.2)",
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 20,
                        color: "#8CC63F",
                        fontWeight: 500,
                      }}
                    >
                      {taniEstimate > 0 ? taniEstimate.toLocaleString() : "0.00"}
                    </span>
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 13,
                        color: "#8FA888",
                      }}
                    >
                      $TANI
                    </span>
                  </div>
                </div>

                {/* Rate */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(28,51,32,0.3)",
                    borderRadius: 8,
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 12,
                      color: "#8FA888",
                    }}
                  >
                    Rate aktif
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 12,
                      color: "#8CC63F",
                    }}
                  >
                    1 USDT = {rate} $TANI
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 8,
                      padding: "10px 14px",
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

                {/* Buy Button */}
                <button
                  className="btn-primary"
                  disabled={
                    !usdtAmount || parseFloat(usdtAmount) <= 0 || loading
                  }
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px",
                    fontSize: 15,
                    opacity:
                      !usdtAmount || parseFloat(usdtAmount) <= 0 ? 0.5 : 1,
                  }}
                  onClick={handleBuy}
                >
                  {loading ? "Menunggu konfirmasi Phantom..." : "Buy $TANI"}
                </button>

                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 11,
                    color: "rgba(143,168,136,0.5)",
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  * Estimasi dapat berubah mengikuti pergerakan rate
                </p>
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Wallet status */}
            {connected && (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.12)",
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 11,
                    color: "rgba(140,198,63,0.6)",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Wallet Aktif
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
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
                    {publicKey?.toString().slice(0, 12)}...
                    {publicKey?.toString().slice(-6)}
                  </span>
                </div>
              </div>
            )}

            {/* Flow info */}
            <div
              style={{
                background: "rgba(17,34,20,0.7)",
                border: "1px solid rgba(140,198,63,0.12)",
                borderRadius: 16,
                padding: 24,
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
                Cara Kerja
              </p>
              {[
                {
                  step: "01",
                  text: "USDT kamu dikirim ke USDT Treasury Wallet platform",
                },
                {
                  step: "02",
                  text: "$TANI dikirim dari Sale Inventory Wallet ke wallet kamu",
                },
                {
                  step: "03",
                  text: "$TANI siap digunakan untuk convert ke Plot NFT",
                },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: 11,
                      color: "#8CC63F",
                      minWidth: 24,
                    }}
                  >
                    {item.step}
                  </span>
                  <p
                    style={{
                      color: "#8FA888",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Preview routing */}
            {taniEstimate > 0 && (
              <div
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.15)",
                  borderRadius: 16,
                  padding: 24,
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
                  Preview Transaksi
                </p>
                {[
                  {
                    label: "Kamu bayar",
                    value: `${usdtAmount} USDT`,
                    color: "#E8EED8",
                  },
                  {
                    label: "Kamu terima",
                    value: `${taniEstimate.toLocaleString()} $TANI`,
                    color: "#8CC63F",
                  },
                  {
                    label: "Rate",
                    value: `1 USDT = ${rate} $TANI`,
                    color: "#8FA888",
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
                        fontSize: 13,
                        color: row.color,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Legal note */}
            <div
              style={{
                background: "rgba(212,168,67,0.06)",
                border: "1px solid rgba(212,168,67,0.15)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <p
                style={{
                  color: "#D4A843",
                  fontSize: 12,
                  fontFamily: "DM Sans",
                  lineHeight: 1.6,
                }}
              >
                <strong>Catatan:</strong> $TANI adalah Allocation Token untuk
                memperoleh Plot NFT di platform Z4. Bukan instrumen investasi
                atau token spekulatif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
