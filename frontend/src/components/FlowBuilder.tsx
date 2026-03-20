"use client";
import { useCallback, useRef, useState } from "react";
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

const CHIPS: { type: ActionType }[] = [
  { type: "SWAP" },
  { type: "BRIDGE" },
  { type: "STAKE" },
  { type: "TRANSFER" },
];

let nodeIdCounter = 0;
const getNodeId = () => `node_${++nodeIdCounter}`;

interface FlowBuilderProps {
  onChange: (actions: Action[]) => void;
}

export function FlowBuilder({ onChange }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggingChip, setDraggingChip] = useState<string | null>(null);
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
          x: bounds.width / 2 - 110,
          y: 100 + nodes.length * 110,
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
        x: e.clientX - bounds.left - 110,
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
            gap: "14px",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(12,12,22,0.8)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          {CHIPS.map((chip, i) => {
            const cfg = ACTION_CONFIG[chip.type];
            const isDragging = draggingChip === chip.type;
            return (
              <motion.div
                key={chip.type}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                draggable
                onDragStart={(e: any) => {
                  e.dataTransfer.setData("actionType", chip.type);
                  setDraggingChip(chip.type);
                }}
                onDragEnd={() => setDraggingChip(null)}
                onClick={() => spawnNode(chip.type)}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.94, y: 2 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100px",
                  height: "80px",
                  borderRadius: "14px",
                  cursor: "grab",
                  userSelect: "none",
                  opacity: isDragging ? 0.4 : 1,
                  /* Physical key surface */
                  background:
                    "linear-gradient(160deg, #1e1e34 0%, #171728 55%, #111120 100%)",
                  boxShadow: `
                    0 1px 0 0 ${cfg.color}88 inset,
                    1px 0 0 0 rgba(255,255,255,0.04) inset,
                    -1px 0 0 0 rgba(0,0,0,0.3) inset,
                    0 -4px 0 0 rgba(0,0,0,0.5) inset,
                    0 0 0 1px rgba(255,255,255,0.06),
                    0 5px 0 0 #080812,
                    0 8px 20px rgba(0,0,0,0.55),
                    0 0 28px ${cfg.color}0e
                  `,
                  transition: "opacity 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: cfg.bg,
                    border: `1px solid ${cfg.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    color: cfg.color,
                  }}
                >
                  {cfg.icon}
                </div>
                {/* Label */}
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {chip.type}
                </span>
              </motion.div>
            );
          })}

          <span
            style={{
              color: "rgba(255,255,255,0.12)",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
              marginLeft: "4px",
            }}
          >
            drag or click
          </span>
        </div>

        {/* ── Canvas ── */}
        <div ref={reactFlowWrapper} style={{ flex: 1, position: "relative" }}>
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
                    color: "rgba(255,255,255,0.08)",
                    fontSize: "0.85rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  Drop an action to start your flow
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Radial canvas glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(106,13,173,0.04) 0%, transparent 70%)",
            }}
          />

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
              color="rgba(255,255,255,0.05)"
            />
            <Controls
              style={{
                background: "rgba(18,18,32,0.95)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
              }}
            />
            <MiniMap
              style={{
                background: "rgba(18,18,32,0.95)",
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
                return c[n.data?.type] ?? "#555";
              }}
              maskColor="rgba(12,12,22,0.78)"
            />
          </ReactFlow>
        </div>

        <style>{`
          .react-flow__controls button {
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            color: #555 !important;
            fill: #555 !important;
          }
          .react-flow__controls button:hover {
            color: #fff !important; fill: #fff !important;
            background: rgba(233,30,140,0.07) !important;
          }
          .react-flow__controls button:last-child { border-bottom: none !important; }
          .react-flow__node { transition: transform 0.2s ease; }
        `}</style>
      </div>
    </HoveredNodeContext.Provider>
  );
}
