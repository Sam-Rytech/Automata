"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ActionNode,
  ACTION_CONFIG,
  HoveredNodeContext,
  type ActionType,
  type ActionNodeData,
} from "./ActionNode";
import type { Action } from "@/lib/types";

const nodeTypes = { action: ActionNode };
const CHIPS: ActionType[] = ["SWAP", "BRIDGE", "STAKE", "TRANSFER"];
const FONT = "'Syne', var(--font-syne-var), sans-serif";

let nodeIdCounter = 0;
const getNodeId = () => `node_${++nodeIdCounter}`;

interface FlowBuilderProps {
  onChange: (actions: Action[]) => void;
}

// Invisible drag ghost elements — one per chip type
// We render them off-screen and use them as the drag image
function DragGhosts() {
  return (
    <div
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        pointerEvents: "none",
      }}
    >
      {CHIPS.map((type) => {
        const cfg = ACTION_CONFIG[type];
        return (
          <div
            key={type}
            id={`drag-ghost-${type}`}
            style={{
              width: 90,
              height: 72,
              borderRadius: "12px",
              background:
                "linear-gradient(160deg, #2a2040 0%, #1a1530 55%, #130f25 100%)",
              border: `1px solid ${cfg.color}66`,
              borderTop: `2px solid ${cfg.color}`,
              boxShadow: `0 8px 24px rgba(0,0,0,0.7), 0 0 30px ${cfg.color}25`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              fontFamily: FONT,
            }}
          >
            <span style={{ fontSize: "22px", color: cfg.color }}>
              {cfg.icon}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {type}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function FlowBuilder({ onChange }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggingChip, setDraggingChip] = useState<ActionType | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const emitActions = useCallback(
    (ns: Node[]) => {
      onChange(
        ns.map((n) => ({
          id: n.id,
          type: n.data.type,
          destinationParaId: n.data.destinationParaId,
          gasLimit: n.data.gasLimit,
        })),
      );
    },
    [onChange],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => {
        const u = nds.filter((n) => n.id !== id);
        emitActions(u);
        return u;
      });
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    },
    [setNodes, setEdges, emitActions],
  );

  const updateNode = useCallback(
    (id: string, data: Partial<ActionNodeData>) => {
      setNodes((nds) => {
        const u = nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
        );
        emitActions(u);
        return u;
      });
    },
    [setNodes, emitActions],
  );

  const spawnNode = useCallback(
    (type: ActionType, position?: { x: number; y: number }) => {
      if (!rfInstance || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const pos =
        position ??
        rfInstance.project({
          x: bounds.width / 2 - 100,
          y: 80 + nodes.length * 120,
        });
      const id = getNodeId();
      const newNode: Node<ActionNodeData> = {
        id,
        type: "action",
        position: pos,
        data: {
          type,
          destinationParaId: 1000,
          gasLimit: 5000000,
          onDelete: deleteNode,
          onUpdate: updateNode,
        },
      };
      setNodes((nds) => {
        const u = [...nds, newNode];
        if (nds.length > 0) {
          const prev = nds[nds.length - 1];
          setEdges((eds) => [
            ...eds,
            {
              id: `e_${prev.id}_${id}`,
              source: prev.id,
              target: id,
              animated: true,
              style: { stroke: "#e91e8c", strokeWidth: 1.5, opacity: 0.5 },
            },
          ]);
        }
        emitActions(u);
        return u;
      });
    },
    [
      rfInstance,
      nodes.length,
      deleteNode,
      updateNode,
      setNodes,
      setEdges,
      emitActions,
    ],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#e91e8c", strokeWidth: 1.5, opacity: 0.5 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("actionType") as ActionType;
      if (!type || !rfInstance || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left - 100,
        y: e.clientY - bounds.top - 60,
      });
      spawnNode(type, position);
      setDraggingChip(null);
    },
    [rfInstance, spawnNode],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <HoveredNodeContext.Provider value={{ hoveredId, setHoveredId }}>
      <DragGhosts />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Chip tray ── */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(10,10,20,0.9)",
            backdropFilter: "blur(12px)",
            zIndex: 10,
            position: "relative",
          }}
        >
          {CHIPS.map((type, i) => {
            const cfg = ACTION_CONFIG[type];
            const isDragging = draggingChip === type;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isDragging ? 0.25 : 1, y: 0 }}
                transition={{
                  opacity: { duration: 0.15 },
                  y: {
                    delay: i * 0.06,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                draggable
                onDragStart={(e: any) => {
                  e.dataTransfer.setData("actionType", type);
                  // Use the off-screen ghost element as the drag image
                  const ghost = document.getElementById(`drag-ghost-${type}`);
                  if (ghost) e.dataTransfer.setDragImage(ghost, 45, 36);
                  setDraggingChip(type);
                }}
                onDragEnd={() => setDraggingChip(null)}
                onClick={() => spawnNode(type)}
                whileHover={{ y: -5, scale: 1.06 }}
                whileTap={{ y: 2, scale: 0.94 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  width: "90px",
                  height: "72px",
                  borderRadius: "12px",
                  cursor: "grab",
                  userSelect: "none",
                  fontFamily: FONT,
                  /* Deep physical key — much more aggressive than before */
                  background: `linear-gradient(170deg, #252040 0%, #1a1630 40%, #120e22 100%)`,
                  boxShadow: `
                    /* Top rim light — bright color flash */
                    0 1.5px 0 0 ${cfg.color} inset,
                    /* Left subtle highlight */
                    1px 0 0 0 rgba(255,255,255,0.06) inset,
                    /* Right dark edge */
                    -1px 0 0 0 rgba(0,0,0,0.5) inset,
                    /* Bottom thickness — key depth */
                    0 -5px 0 0 rgba(0,0,0,0.7) inset,
                    /* Outer border */
                    0 0 0 1px rgba(255,255,255,0.08),
                    /* Physical drop shadow — key sitting on surface */
                    0 6px 0 0 #060410,
                    0 10px 22px rgba(0,0,0,0.7),
                    /* Ambient color glow */
                    0 0 30px ${cfg.color}18
                  `,
                  transition: "opacity 0.15s",
                }}
              >
                {/* Icon face */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: `radial-gradient(circle at 40% 35%, ${cfg.color}28, ${cfg.color}0d)`,
                    border: `1px solid ${cfg.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: cfg.color,
                    boxShadow: `0 1px 0 ${cfg.color}33 inset`,
                  }}
                >
                  {cfg.icon}
                </div>
                {/* Label */}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: FONT,
                  }}
                >
                  {type}
                </span>
              </motion.div>
            );
          })}

          <span
            style={{
              color: "rgba(255,255,255,0.1)",
              fontSize: "0.62rem",
              letterSpacing: "0.05em",
              marginLeft: "6px",
              fontFamily: FONT,
            }}
          >
            drag or click
          </span>
        </div>

        {/* ── Canvas ── */}
        <div ref={reactFlowWrapper} style={{ flex: 1, position: "relative" }}>
          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(106,13,173,0.05) 0%, transparent 70%)",
            }}
          />

          {/* Empty state */}
          <AnimatePresence>
            {nodes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.07)",
                    fontSize: "0.82rem",
                    letterSpacing: "0.1em",
                    fontFamily: FONT,
                  }}
                >
                  Drop an action here to start
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ background: "transparent" }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(255,255,255,0.045)"
            />
            <Controls
              style={{
                background: "rgba(14,14,26,0.95)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
              }}
            />
            <MiniMap
              style={{
                background: "rgba(14,14,26,0.95)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
              }}
              nodeColor={(n) => {
                const c: Record<string, string> = {
                  SWAP: "#e91e8c",
                  BRIDGE: "#9d5ff5",
                  STAKE: "#1db954",
                  TRANSFER: "#4C9FFF",
                };
                return c[n.data?.type] ?? "#444";
              }}
              maskColor="rgba(10,10,20,0.8)"
            />
          </ReactFlow>
        </div>

        <style>{`
          .react-flow__controls button {
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            color: #555 !important; fill: #555 !important;
          }
          .react-flow__controls button:hover {
            color: #fff !important; fill: #fff !important;
            background: rgba(233,30,140,0.07) !important;
          }
          .react-flow__controls button:last-child { border-bottom: none !important; }
          .react-flow__node { overflow: visible !important; }
        `}</style>
      </div>
    </HoveredNodeContext.Provider>
  );
}
