"use client";
import { useState, useRef, useContext, createContext } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export type ActionType = "SWAP" | "BRIDGE" | "STAKE" | "TRANSFER";

export interface ActionNodeData {
  type: ActionType;
  destinationParaId: number;
  gasLimit: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<ActionNodeData>) => void;
  isHoveredOther?: boolean;
}

export const ACTION_CONFIG: Record<
  ActionType,
  { color: string; bg: string; icon: string; label: string }
> = {
  SWAP: {
    color: "#e91e8c",
    bg: "rgba(233,30,140,0.08)",
    icon: "⇄",
    label: "Swap tokens across chains",
  },
  BRIDGE: {
    color: "#9d5ff5",
    bg: "rgba(157,95,245,0.08)",
    icon: "⬡",
    label: "Bridge to parachain",
  },
  STAKE: {
    color: "#1db954",
    bg: "rgba(29,185,84,0.08)",
    icon: "◈",
    label: "Stake native tokens",
  },
  TRANSFER: {
    color: "#4C9FFF",
    bg: "rgba(76,159,255,0.08)",
    icon: "→",
    label: "Transfer assets",
  },
};

const PARACHAINS = [
  { label: "AssetHub (1000)", value: 1000 },
  { label: "Moonbeam (2004)", value: 2004 },
  { label: "Astar (2006)", value: 2006 },
  { label: "Custom", value: 0 },
];

// Context to track which node is hovered across all nodes
export const HoveredNodeContext = createContext<{
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}>({ hoveredId: null, setHoveredId: () => {} });

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

export function ActionNode({ id, data, selected }: NodeProps<ActionNodeData>) {
  const cfg = ACTION_CONFIG[data.type];
  const { hoveredId, setHoveredId } = useContext(HoveredNodeContext);
  const ref = useRef<HTMLDivElement>(null);

  // Tilt spring values (only active when selected)
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 180, damping: 20 });
  const springRotY = useSpring(rotY, { stiffness: 180, damping: 20 });

  const isHovered = hoveredId === id;
  const isDimmed = hoveredId !== null && !isHovered;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selected || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 5);
    rotX.set(-((e.clientY - cy) / (rect.height / 2)) * 5);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDimmed ? 0.88 : isHovered ? 1.03 : 1,
        opacity: isDimmed ? 0.38 : 1,
        rotateX: selected ? (springRotX as any) : 0,
        rotateY: selected ? (springRotY as any) : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 22 },
        opacity: { duration: 0.2 },
        // Entry spring pop
        ...{},
      }}
      style={{
        width: 220,
        transformStyle: "preserve-3d",
        perspective: "600px",
        borderRadius: "14px",
        background:
          "linear-gradient(145deg, #1e1e34 0%, #161628 55%, #101020 100%)",
        border: `1px solid ${selected ? cfg.color + "55" : "rgba(255,255,255,0.07)"}`,
        borderTop: `2px solid ${selected ? cfg.color : cfg.color + "60"}`,
        boxShadow: selected
          ? `0 2px 0 rgba(255,255,255,0.05) inset, 0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px ${cfg.color}30, 0 0 60px ${cfg.color}14`
          : isHovered
            ? `0 2px 0 rgba(255,255,255,0.05) inset, 0 12px 40px rgba(0,0,0,0.6), 0 0 40px ${cfg.color}12`
            : "0 2px 0 rgba(255,255,255,0.04) inset, 0 4px 20px rgba(0,0,0,0.45)",
        transition: "border-color 0.2s, box-shadow 0.25s",
        fontFamily: "inherit",
        cursor: "grab",
      }}
      onMouseEnter={() => setHoveredId(id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: cfg.color,
          border: "2px solid #0f0f1a",
          width: 10,
          height: 10,
          top: -5,
        }}
      />

      {/* Card header */}
      <div
        style={{
          padding: "0.85rem 0.9rem 0.65rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* Icon badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: cfg.bg,
              border: `1px solid ${cfg.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              color: cfg.color,
              flexShrink: 0,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <p
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              {data.type}
            </p>
            <p
              style={{
                color: "#555",
                fontSize: "0.68rem",
                marginTop: "1px",
                lineHeight: 1,
              }}
            >
              {cfg.label}
            </p>
          </div>
        </div>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete(id);
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: "7px",
            background: "transparent",
            border: "1px solid transparent",
            color: "#444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,68,68,0.25)";
            e.currentTarget.style.color = "#ff4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.color = "#444";
          }}
        >
          <TrashIcon />
        </motion.button>
      </div>

      {/* Config fields */}
      <div
        style={{
          padding: "0.7rem 0.9rem 0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.55rem",
        }}
      >
        {/* Destination */}
        <div>
          <label
            style={{
              color: "#444",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "0.3rem",
            }}
          >
            Destination
          </label>
          <select
            value={data.destinationParaId}
            onChange={(e) =>
              data.onUpdate(id, { destinationParaId: Number(e.target.value) })
            }
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "7px",
              color: "#ccc",
              fontSize: "0.82rem",
              padding: "0.4rem 0.65rem",
              fontFamily: "inherit",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {PARACHAINS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ background: "#1a1a2e" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gas limit */}
        <div>
          <label
            style={{
              color: "#444",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "0.3rem",
            }}
          >
            Gas Limit
          </label>
          <input
            type="number"
            value={data.gasLimit}
            onChange={(e) =>
              data.onUpdate(id, { gasLimit: Number(e.target.value) })
            }
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "7px",
              color: "#ccc",
              fontSize: "0.82rem",
              padding: "0.4rem 0.65rem",
              fontFamily: "monospace",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: cfg.color,
          border: "2px solid #0f0f1a",
          width: 10,
          height: 10,
          bottom: -5,
        }}
      />
    </motion.div>
  );
}
