'use client'
import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { ActionNode, type ActionType, type ActionNodeData } from './ActionNode'
import type { Action } from '@/lib/types'

const nodeTypes = { action: ActionNode }

const ACTION_CHIPS: { type: ActionType; color: string; arcX: number; arcY: number }[] = [
  { type: 'SWAP',     color: '#e91e8c', arcX: -140, arcY: -60 },
  { type: 'BRIDGE',   color: '#9d5ff5', arcX: -48,  arcY: -88 },
  { type: 'STAKE',    color: '#1db954', arcX:  48,   arcY: -88 },
  { type: 'TRANSFER', color: '#4C9FFF', arcX:  140,  arcY: -60 },
]

let nodeIdCounter = 0
const getNodeId = () => `node_${++nodeIdCounter}`

interface FlowBuilderProps {
  onChange: (actions: Action[]) => void
}

export function FlowBuilder({ onChange }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const emitActions = useCallback((currentNodes: Node[]) => {
    const actions: Action[] = currentNodes.map(n => ({
      id: n.id,
      type: n.data.type as ActionType,
      destinationParaId: n.data.destinationParaId,
      gasLimit: n.data.gasLimit,
    }))
    onChange(actions)
  }, [onChange])

  const deleteNode = useCallback((id: string) => {
    setNodes(nds => {
      const updated = nds.filter(n => n.id !== id)
      emitActions(updated)
      return updated
    })
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id))
  }, [setNodes, setEdges, emitActions])

  const updateNode = useCallback((id: string, data: Partial<ActionNodeData>) => {
    setNodes(nds => {
      const updated = nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n)
      emitActions(updated)
      return updated
    })
  }, [setNodes, emitActions])

  const addNode = useCallback((type: ActionType) => {
    if (!rfInstance) return
    const id = getNodeId()
    const center = rfInstance.project({
      x: (reactFlowWrapper.current?.clientWidth ?? 600) / 2 - 110,
      y: (reactFlowWrapper.current?.clientHeight ?? 500) / 2 - 60 + (nodes.length * 90),
    })

    const newNode: Node<ActionNodeData> = {
      id,
      type: 'action',
      position: center,
      data: {
        type,
        destinationParaId: 1000,
        gasLimit: 5000000,
        onDelete: deleteNode,
        onUpdate: updateNode,
      },
    }

    setNodes(nds => {
      const updated = [...nds, newNode]
      // Auto-connect to previous node
      if (nds.length > 0) {
        const prev = nds[nds.length - 1]
        setEdges(eds => [...eds, {
          id: `e_${prev.id}_${id}`,
          source: prev.id,
          target: id,
          animated: true,
          style: { stroke: '#e91e8c', strokeWidth: 1.5, opacity: 0.6 },
        }])
      }
      emitActions(updated)
      return updated
    })
  }, [rfInstance, nodes.length, deleteNode, updateNode, setNodes, setEdges, emitActions])

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#e91e8c', strokeWidth: 1.5, opacity: 0.6 },
    }, eds))
  }, [setEdges])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('actionType') as ActionType
    if (!type || !rfInstance || !reactFlowWrapper.current) return
    const bounds = reactFlowWrapper.current.getBoundingClientRect()
    const position = rfInstance.project({ x: e.clientX - bounds.left - 110, y: e.clientY - bounds.top - 40 })
    const id = getNodeId()
    const newNode: Node<ActionNodeData> = {
      id, type: 'action', position,
      data: { type, destinationParaId: 1000, gasLimit: 5000000, onDelete: deleteNode, onUpdate: updateNode },
    }
    setNodes(nds => { const u = [...nds, newNode]; emitActions(u); return u })
  }, [rfInstance, deleteNode, updateNode, setNodes, emitActions])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Floating action chips in arc */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: nodes.length > 0 ? 'none' : 'auto',
        opacity: nodes.length > 0 ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        {ACTION_CHIPS.map((chip, i) => (
          <motion.button
            key={chip.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.12, y: chip.arcY - 4 }}
            whileTap={{ scale: 0.95 }}
            draggable
            onDragStart={e => e.dataTransfer.setData('actionType', chip.type)}
            onClick={() => addNode(chip.type)}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${chip.arcX}px), calc(-50% + ${chip.arcY}px))`,
              background: 'rgba(15,15,26,0.92)',
              border: `1px solid ${chip.color}55`,
              borderRadius: '999px',
              padding: '0.3rem 0.85rem',
              color: chip.color,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'grab',
              fontFamily: 'inherit',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 12px ${chip.color}18, 0 2px 8px rgba(0,0,0,0.4)`,
              animation: `float-chip ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {chip.type}
          </motion.button>
        ))}

        {/* Center hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, 20px)',
            color: 'rgba(255,255,255,0.2)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          drag or click to add
        </motion.p>
      </div>

      {/* React Flow canvas */}
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
          style={{ background: 'transparent' }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1}
            color="rgba(255,255,255,0.07)"
          />
          <Controls
            style={{
              background: 'rgba(22,33,62,0.9)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
            }}
          />
          <MiniMap
            style={{
              background: 'rgba(22,33,62,0.9)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
            }}
            nodeColor={n => {
              const colors: Record<ActionType, string> = { SWAP: '#e91e8c', BRIDGE: '#9d5ff5', STAKE: '#1db954', TRANSFER: '#4C9FFF' }
              return colors[n.data?.type as ActionType] ?? '#888'
            }}
            maskColor="rgba(15,15,26,0.8)"
          />
        </ReactFlow>
      </div>

      <style>{`
        @keyframes float-chip {
          0%, 100% { transform: translate(calc(-50% + var(--ax, 0px)), calc(-50% + var(--ay, 0px))); }
          50% { transform: translate(calc(-50% + var(--ax, 0px)), calc(-50% + var(--ay, 0px) - 5px)); }
        }
        .react-flow__controls button {
          background: transparent !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.07) !important;
          color: #888 !important;
          fill: #888 !important;
        }
        .react-flow__controls button:hover {
          color: #fff !important;
          fill: #fff !important;
          background: rgba(233,30,140,0.1) !important;
        }
        .react-flow__controls button:last-child { border-bottom: none !important; }
      `}</style>
    </div>
  )
}