"use client";
import { useRef, useContext, createContext } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { motion, useMotionValue, useSpring } from "framer-motion";

export type ActionType = "SWAP" | "BRIDGE" | "STAKE" | "TRANSFER";

export interface ActionNodeData {
  type: ActionType;
  destinationParaId: number;
  gasLimit: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<ActionNodeData>) => void;
}

export const ACTION_CONFIG: Record<
  ActionType,
  { color: string; bg: string; icon: string }
> = {
  SWAP: { color: "#e91e8c", bg: "rgba(233,30,140,0.1)", icon: "⇄" },
  BRIDGE: { color: "#9d5ff5", bg: "rgba(157,95,245,0.1)", icon: "⬡" },
  STAKE: { color: "#1db954", bg: "rgba(29,185,84,0.1)", icon: "◈" },
  TRANSFER: { color: "#4C9FFF", bg: "rgba(76,159,255,0.1)", icon: "→" },
};

const PARACHAINS = [
  { label: "AssetHub (1000)", value: 1000 },
  { label: "Moonbeam (2004)", value: 2004 },
  { label: "Astar (2006)", value: 2006 },
  { label: "Custom", value: 0 },
];

export const HoveredNodeContext = createContext<{
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}>({ hoveredId: null, setHoveredId: () => {} });

const TrashIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

export function ActionNode({ id, data, selected }: NodeProps<ActionNodeData>) {
  const cfg = ACTION_CONFIG[data.type];
  const { hoveredId, setHoveredId } = useContext(HoveredNodeContext);
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 200, damping: 22 });
  const springY = useSpring(rotY, { stiffness: 200, damping: 22 });

  const isHovered = hoveredId === id;
  const isDimmed = hoveredId !== null && !isHovered;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selected || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    rotX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0, y: -8 }}
      animate={{
        scale: isDimmed ? 0.85 : 1,
        opacity: isDimmed ? 0.28 : 1,
        y: 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 280, damping: 24 },
        opacity: { duration: 0.18 },
        y: { type: "spring", stiffness: 400, damping: 28 },
      }}
      style={{
        width: 160,
        transformStyle: "preserve-3d",
        perspective: "600px",
        rotateX: selected ? springX : 0,
        rotateY: selected ? springY : 0,
      }}
      onMouseEnter={() => setHoveredId(id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredId(null);
        rotX.set(0);
        rotY.set(0);
      }}
    >
      <motion.div
        animate={{
          boxShadow: selected
            ? `0 1px 0 rgba(255,255,255,0.08) inset,
               0 -6px 0 rgba(0,0,0,0.65) inset,
               0 0 0 1px ${cfg.color}55,
               0 8px 0 #040210,
               0 14px 32px rgba(0,0,0,0.7),
               0 0 50px ${cfg.color}20`
            : isHovered
              ? `0 1px 0 rgba(255,255,255,0.06) inset,
               0 -6px 0 rgba(0,0,0,0.65) inset,
               0 0 0 1px rgba(255,255,255,0.1),
               0 8px 0 #040210,
               0 14px 28px rgba(0,0,0,0.65),
               0 0 35px ${cfg.color}14`
              : `0 1px 0 rgba(255,255,255,0.05) inset,
               0 -6px 0 rgba(0,0,0,0.65) inset,
               0 0 0 1px rgba(255,255,255,0.06),
               0 6px 0 #040210,
               0 10px 22px rgba(0,0,0,0.6)`,
        }}
        transition={{ duration: 0.2 }}
        style={{
          borderRadius: "10px",
          background:
            "linear-gradient(160deg, #1e1e36 0%, #161628 50%, #0f0f1e 100%)",
          border: `1px solid ${selected ? cfg.color + "44" : "rgba(255,255,255,0.06)"}`,
          /* The KEY: bright colored top border = rim light */
          borderTop: `2px solid ${cfg.color}${selected ? "ee" : "88"}`,
          overflow: "hidden",
          cursor: "grab",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "0.45rem 0.55rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "5px",
                background: cfg.bg,
                border: `1px solid ${cfg.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: cfg.color,
                flexShrink: 0,
              }}
            >
              {cfg.icon}
            </div>
            <p
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.06em",
                lineHeight: 1,
              }}
            >
              {data.type}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
            style={{
              width: 18,
              height: 18,
              borderRadius: "4px",
              background: "transparent",
              border: "1px solid transparent",
              color: "#2a2a45",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,68,68,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,68,68,0.3)";
              e.currentTarget.style.color = "#ff5555";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.color = "#2a2a45";
            }}
          >
            <TrashIcon />
          </button>
        </div>

        {/* Fields */}
        <div
          style={{
            padding: "0.45rem 0.55rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.38rem",
          }}
        >
          <div>
            <label
              style={{
                color: "#2e2e50",
                fontSize: "0.52rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              Dest
            </label>
            <select
              value={data.destinationParaId}
              onChange={(e) =>
                data.onUpdate(id, { destinationParaId: Number(e.target.value) })
              }
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "5px",
                color: "#aaa",
                fontSize: "0.68rem",
                padding: "0.28rem 0.45rem",
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

          <div>
            <label
              style={{
                color: "#2e2e50",
                fontSize: "0.52rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              Gas
            </label>
            <input
              type="number"
              value={data.gasLimit}
              onChange={(e) =>
                data.onUpdate(id, { gasLimit: Number(e.target.value) })
              }
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "5px",
                color: "#aaa",
                fontSize: "0.68rem",
                padding: "0.28rem 0.45rem",
                fontFamily: "monospace",
                outline: "none",
              }}
            />
          </div>
        </div>
      </motion.div>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: cfg.color,
          border: "2px solid #0f0f1a",
          width: 8,
          height: 8,
          top: -4,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: cfg.color,
          border: "2px solid #0f0f1a",
          width: 8,
          height: 8,
          bottom: -4,
        }}
      />
    </motion.div>
  );
}
