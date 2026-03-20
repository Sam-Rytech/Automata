"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowBuilder } from "@/components/FlowBuilder";
import { StatusPanel, type StatusState } from "@/components/StatusPanel";
import { ExecuteButton } from "@/components/ExecuteButton";
import { SkeuoButton } from "@/components/ui/skeuo-button";
import type { Action } from "@/lib/types";

const ACTION_COLORS: Record<string, string> = {
  SWAP: "#e91e8c",
  BRIDGE: "#9d5ff5",
  STAKE: "#1db954",
  TRANSFER: "#4C9FFF",
};

interface SimResult {
  estimatedFee: string;
  gasEstimate: string;
  warnings: string[];
  safe: boolean;
}

function SimulateDialog({
  result,
  onClose,
}: {
  result: SimResult;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "1rem",
          background: "linear-gradient(145deg, #1c1c30, #141428)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid rgba(233,30,140,0.6)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(233,30,140,0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
            Simulation Result
          </h3>
          <span
            style={{
              padding: "0.22rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: result.safe
                ? "rgba(29,185,84,0.1)"
                : "rgba(255,165,0,0.1)",
              border: `1px solid ${result.safe ? "rgba(29,185,84,0.3)" : "rgba(255,165,0,0.3)"}`,
              color: result.safe ? "#1db954" : "#ffa500",
            }}
          >
            {result.safe ? "✓ Looks Good" : "⚠ Caution"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { label: "Estimated Fee", value: result.estimatedFee },
            { label: "Gas Estimate", value: result.gasEstimate },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.65rem 0.9rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#666", fontSize: "0.8rem" }}>
                {row.label}
              </span>
              <span
                style={{
                  color: "#ddd",
                  fontSize: "0.82rem",
                  fontFamily: "monospace",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
          {result.warnings.length > 0 && (
            <div
              style={{
                padding: "0.75rem 0.9rem",
                background: "rgba(255,165,0,0.04)",
                border: "1px solid rgba(255,165,0,0.18)",
                borderRadius: "8px",
              }}
            >
              {result.warnings.map((w, i) => (
                <p
                  key={i}
                  style={{
                    color: "#cc8800",
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                  }}
                >
                  • {w}
                </p>
              ))}
            </div>
          )}
        </div>

        <SkeuoButton
          size="sm"
          onClick={onClose}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Got it
        </SkeuoButton>
      </motion.div>
    </motion.div>
  );
}

function ConfigPanel({
  status,
  message,
  txHash,
  actions,
  onStatusChange,
}: {
  status: StatusState;
  message?: string;
  txHash?: string;
  actions: Action[];
  onStatusChange: (s: StatusState, m?: string, h?: string) => void;
}) {
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimResult | null>(null);

  const handleSimulate = async () => {
    if (actions.length === 0) return;
    setSimulating(true);
    try {
      const { simulateFlow } = await import("@/lib/api");
      const result = await simulateFlow(actions);
      setSimResult(result);
    } catch {
      setSimResult({
        estimatedFee: "~0.01 DEV",
        gasEstimate: "5,000,000",
        warnings: ["Backend unreachable — estimate only"],
        safe: false,
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "0.85rem 1.1rem 0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            color: "#444",
            fontSize: "0.62rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Configuration
        </p>
      </div>

      {/* Flow summary */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.1rem" }}>
        <AnimatePresence mode="wait">
          {actions.length > 0 ? (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                style={{
                  color: "#555",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.85rem",
                }}
              >
                Flow · {actions.length}{" "}
                {actions.length === 1 ? "action" : "actions"}
              </p>
              {actions.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.5rem",
                    padding: "0.5rem 0.7rem",
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${ACTION_COLORS[a.type]}18`,
                    borderLeft: `2px solid ${ACTION_COLORS[a.type]}`,
                    borderRadius: "7px",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: `${ACTION_COLORS[a.type]}18`,
                      border: `1px solid ${ACTION_COLORS[a.type]}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.52rem",
                      fontWeight: 700,
                      color: ACTION_COLORS[a.type],
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      color: "#aaa",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {a.type}
                  </span>
                  <span
                    style={{
                      color: "#3a3a5a",
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                      marginLeft: "auto",
                    }}
                  >
                    →{a.destinationParaId}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: "#282840", fontSize: "0.78rem", lineHeight: 1.8 }}
            >
              No actions yet.
              <br />
              Use the chips above to build your flow.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "0.8rem 1.1rem",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleSimulate}
          disabled={actions.length === 0 || simulating}
          style={{
            width: "100%",
            padding: "0.65rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "8px",
            color: actions.length === 0 ? "#242438" : "#888",
            fontSize: "0.78rem",
            fontFamily: "inherit",
            cursor: actions.length === 0 ? "not-allowed" : "pointer",
            letterSpacing: "0.06em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (actions.length > 0) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.color = "#ccc";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color =
              actions.length === 0 ? "#242438" : "#888";
          }}
        >
          {simulating ? "Simulating..." : "Simulate"}
        </button>

        <ExecuteButton actions={actions} onStatusChange={onStatusChange} />
      </div>

      <StatusPanel status={status} message={message} txHash={txHash} />

      <AnimatePresence>
        {simResult && (
          <SimulateDialog
            result={simResult}
            onClose={() => setSimResult(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuildPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [status, setStatus] = useState<StatusState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();

  const handleStatusChange = useCallback(
    (s: StatusState, m?: string, h?: string) => {
      setStatus(s);
      setStatusMessage(m);
      setTxHash(h);
    },
    [],
  );

  const handleActionsChange = useCallback((newActions: Action[]) => {
    setActions(newActions);
    if (newActions.length === 0) {
      setStatus("idle");
      setStatusMessage(undefined);
      setTxHash(undefined);
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        paddingTop: "56px",
      }}
    >
      {/* Page header */}
      <div
        style={{
          padding: "0.65rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.04em",
            }}
          >
            Flow Builder
          </h1>
          <p style={{ color: "#333", fontSize: "0.7rem", marginTop: "1px" }}>
            Compose cross-chain actions visually
          </p>
        </div>
        <AnimatePresence>
          {actions.length > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                padding: "0.22rem 0.75rem",
                borderRadius: "999px",
                background: "rgba(233,30,140,0.1)",
                border: "1px solid rgba(233,30,140,0.22)",
                color: "#e91e8c",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {actions.length} {actions.length === 1 ? "action" : "actions"}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Canvas 72% */}
        <div
          style={{
            flex: "0 0 72%",
            position: "relative",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <FlowBuilder onChange={handleActionsChange} />
        </div>

        {/* Config 28% */}
        <div
          style={{
            flex: "0 0 28%",
            background: "linear-gradient(180deg, #131326 0%, #0e0e1e 100%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ConfigPanel
            status={status}
            message={statusMessage}
            txHash={txHash}
            actions={actions}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
