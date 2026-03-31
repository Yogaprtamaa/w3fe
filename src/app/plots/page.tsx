"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBlocksSummary, fetchPlots } from "@/lib/api";
import { BlockSummary, Plot } from "@/types";

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

export default function PlotExplorerPage() {
  const [blocks, setBlocks] = useState<BlockSummary[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocksSummary()
      .then((data) => setBlocks(data.blocks || []))
      .catch(() => {});

    fetchPlots()
      .then((data) => {
        setPlots(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPlots = selectedBlock
    ? plots.filter((p) => p.block_id === selectedBlock)
    : plots;

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
            Plot Registry
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
            Plot{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #8CC63F, #5EA85E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Explorer
            </span>
          </h1>
          <p style={{ color: "#8FA888", fontSize: 16, fontFamily: "DM Sans" }}>
            Jelajahi lahan pertanian yang tersedia. Pilih plot dan mulai
            alokasi.
          </p>
        </div>

        {/* Block Filter */}
        <div style={{ marginBottom: 40 }}>
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
            Filter Block
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedBlock(null)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: `1px solid ${
                  !selectedBlock ? "#8CC63F" : "rgba(140,198,63,0.15)"
                }`,
                background: !selectedBlock ? "rgba(140,198,63,0.1)" : "transparent",
                color: !selectedBlock ? "#8CC63F" : "#8FA888",
                fontFamily: "Syne",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Semua Block
            </button>
            {blocks.map((block) => (
              <button
                key={block.block_id}
                onClick={() => setSelectedBlock(block.block_id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: `1px solid ${
                    selectedBlock === block.block_id
                      ? BLOCK_COLORS[block.block_id]
                      : "rgba(140,198,63,0.15)"
                  }`,
                  background:
                    selectedBlock === block.block_id
                      ? `${BLOCK_COLORS[block.block_id]}15`
                      : "transparent",
                  color:
                    selectedBlock === block.block_id
                      ? BLOCK_COLORS[block.block_id]
                      : "#8FA888",
                  fontFamily: "Syne",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: BLOCK_COLORS[block.block_id],
                  }}
                />
                Block {block.block_id}
                <span style={{ fontFamily: "DM Mono", fontSize: 11, opacity: 0.7 }}>
                  {block.available}/{block.total_plots}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Block Summary Cards */}
        {!selectedBlock && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 12,
              marginBottom: 48,
            }}
          >
            {blocks.map((block) => (
              <button
                key={block.block_id}
                onClick={() => setSelectedBlock(block.block_id)}
                style={{
                  background: "rgba(17,34,20,0.7)",
                  border: "1px solid rgba(140,198,63,0.1)",
                  borderRadius: 14,
                  padding: "20px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${BLOCK_COLORS[block.block_id]}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(140,198,63,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${BLOCK_COLORS[block.block_id]}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 900,
                      fontSize: 16,
                      color: BLOCK_COLORS[block.block_id],
                    }}
                  >
                    {block.block_id}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#E8EED8",
                    marginBottom: 4,
                  }}
                >
                  Block {block.block_id}
                </p>
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: 11,
                    color: BLOCK_COLORS[block.block_id],
                  }}
                >
                  {block.available}/{block.total_plots} tersedia
                </p>
                <div
                  style={{
                    marginTop: 10,
                    height: 3,
                    background: "rgba(140,198,63,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: BLOCK_COLORS[block.block_id],
                      width: `${(block.available / block.total_plots) * 100}%`,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Plot Grid */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              }}
            >
              {selectedBlock
                ? `Block ${selectedBlock} — ${filteredPlots.length} Plot`
                : `Semua Plot — ${filteredPlots.length} Terdaftar`}
            </p>
            {selectedBlock && (
              <button
                onClick={() => setSelectedBlock(null)}
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 12,
                  color: "#8FA888",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ← Semua Block
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p
                style={{
                  color: "#8FA888",
                  fontFamily: "DM Mono",
                  fontSize: 14,
                }}
              >
                Memuat data plot...
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
              {filteredPlots.map((plot) => {
                const statusCfg =
                  STATUS_CONFIG[plot.status] || STATUS_CONFIG.available;
                const blockColor = BLOCK_COLORS[plot.block_id];
                const isAvailable =
                  plot.status === "available" || plot.status === "limited";

                return (
                  <Link
                    key={plot.plot_id}
                    href={`/plots/${plot.plot_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: "rgba(17,34,20,0.7)",
                        border: "1px solid rgba(140,198,63,0.08)",
                        borderRadius: 14,
                        padding: 18,
                        cursor: isAvailable ? "pointer" : "default",
                        opacity: isAvailable ? 1 : 0.6,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (isAvailable) {
                          e.currentTarget.style.border = `1px solid ${blockColor}30`;
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(140,198,63,0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Plot ID + Status */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
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
                              fontSize: 12,
                              color: blockColor,
                            }}
                          >
                            {plot.plot_id}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: "DM Mono",
                            fontSize: 10,
                            fontWeight: 500,
                            color: statusCfg.color,
                            background: statusCfg.bg,
                            padding: "3px 8px",
                            borderRadius: 20,
                            border: `1px solid ${statusCfg.color}30`,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      {/* Price */}
                      <p
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: 16,
                          color: "#8CC63F",
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        {parseFloat(plot.price_in_tani).toLocaleString()}
                        <span
                          style={{
                            fontSize: 11,
                            color: "#8FA888",
                            marginLeft: 4,
                          }}
                        >
                          $TANI
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "DM Mono",
                          fontSize: 11,
                          color: "#8FA888",
                          marginBottom: 12,
                        }}
                      >
                        ≈{" "}
                        {parseFloat(
                          plot.price_in_usdt_reference || "0"
                        ).toLocaleString()}{" "}
                        USDT
                      </p>

                      {/* Capacity bar */}
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "DM Mono",
                              fontSize: 10,
                              color: "#8FA888",
                            }}
                          >
                            Kapasitas
                          </span>
                          <span
                            style={{
                              fontFamily: "DM Mono",
                              fontSize: 10,
                              color: "#8FA888",
                            }}
                          >
                            {plot.remaining_capacity}/
                            {plot.total_allocation_capacity}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 3,
                            background: "rgba(140,198,63,0.1)",
                            borderRadius: 2,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 2,
                              background:
                                plot.fill_percentage > 80
                                  ? "#EF4444"
                                  : plot.fill_percentage > 50
                                    ? "#D4A843"
                                    : blockColor,
                              width: `${100 - plot.fill_percentage}%`,
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
