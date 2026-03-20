"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getHistory } from "@/lib/history";
import type { HistoryEntry } from "@/lib/types";

const EXPLORER = "https://moonbase.moonscan.io/tx/";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function truncate(str: string) {
  return `${str.slice(0, 8)}...${str.slice(-6)}`;
}

const ExternalIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setMounted(true);
  }, []);

  const isEmpty = mounted && entries.length === 0;

  return (
    <div
      style={{ minHeight: "100vh", background: "#0f0f1a", paddingTop: "56px" }}
    >
      {/* Top needle */}
      <div
        style={{
          width: "1px",
          height: "60px",
          margin: "0 auto",
          background: "linear-gradient(to bottom, transparent, #e91e8c)",
        }}
      />

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 2.5rem 6rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "3rem" }}
        >
          <p
            style={{
              color: "#e91e8c",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}
          >
            Execution log
          </p>
          <h1
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            History
          </h1>
          <p
            style={{
              color: "#555",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              maxWidth: "420px",
            }}
          >
            Every flow you've executed on Moonbase Alpha, with links to the
            explorer.
          </p>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
                padding: "5rem 2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(233,30,140,0.06)",
                  border: "1px solid rgba(233,30,140,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e91e8c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  No flows executed yet
                </p>
                <p style={{ color: "#333", fontSize: "0.8rem" }}>
                  Execute a flow on the Build page and it will appear here.
                </p>
              </div>
              <Link href="/build" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "0.6rem 1.4rem",
                    background: "rgba(233,30,140,0.08)",
                    border: "1px solid rgba(233,30,140,0.25)",
                    borderRadius: "8px",
                    color: "#e91e8c",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(233,30,140,0.14)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(233,30,140,0.08)")
                  }
                >
                  Start Building →
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        {!isEmpty && mounted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
              background: "linear-gradient(145deg, #1a1a2e, #141420)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 80px 100px 90px 80px",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {["Flow ID", "Actions", "Time", "Status", "Explorer"].map(
                (col) => (
                  <span
                    key={col}
                    style={{
                      color: "#333",
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {col}
                  </span>
                ),
              )}
            </div>

            {/* Rows */}
            {entries.map((entry, i) => (
              <motion.div
                key={entry.txHash}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 80px 100px 90px 80px",
                  padding: "0.85rem 1.25rem",
                  borderBottom:
                    i < entries.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  transition: "background 0.15s",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {/* Flow ID */}
                <span
                  style={{
                    color: "#888",
                    fontSize: "0.78rem",
                    fontFamily: "monospace",
                  }}
                >
                  {truncate(entry.flowId)}
                </span>
                {/* Actions */}
                <span style={{ color: "#666", fontSize: "0.78rem" }}>
                  {entry.actionCount}
                </span>
                {/* Time */}
                <span style={{ color: "#555", fontSize: "0.75rem" }}>
                  {timeAgo(entry.timestamp)}
                </span>
                {/* Status */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#1db954",
                      animation: "pulse-dot 2.5s ease-in-out infinite",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: "#1db954",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    Success
                  </span>
                </span>
                {/* Explorer link */}
                <a
                  href={`${EXPLORER}${entry.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "#4C9FFF",
                    fontSize: "0.72rem",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  View <ExternalIcon />
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
