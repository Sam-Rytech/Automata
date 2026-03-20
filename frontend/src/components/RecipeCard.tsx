"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SkeuoButton } from "@/components/ui/skeuo-button";
import type { Recipe } from "@/lib/types";

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onRun: (id: number) => Promise<void>;
}

export function RecipeCard({ recipe, index, onRun }: RecipeCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 18 });
  const sy = useSpring(y, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    try {
      await onRun(recipe.id);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err: any) {
      setError(err?.message ?? "Execution failed");
      setTimeout(() => setError(null), 4000);
    } finally {
      setRunning(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
    >
      <motion.div
        whileHover={{
          boxShadow:
            "0 2px 0 rgba(255,255,255,0.06) inset, 0 -3px 0 rgba(0,0,0,0.5) inset, 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(233,30,140,0.18), 0 0 80px rgba(233,30,140,0.08)",
        }}
        style={{
          borderRadius: "16px",
          background:
            "linear-gradient(145deg, #1c1c32 0%, #141426 60%, #0f0f1e 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderTop: "1px solid rgba(255,255,255,0.11)",
          boxShadow:
            "0 2px 0 rgba(255,255,255,0.04) inset, 0 -3px 0 rgba(0,0,0,0.5) inset, 0 8px 32px rgba(0,0,0,0.45)",
          padding: "1.5rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          transition: "box-shadow 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Moving spotlight */}
        <motion.div
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 70%)",
            left: useTransform(sx, [-0.5, 0.5], ["0%", "100%"]),
            top: useTransform(sy, [-0.5, 0.5], ["0%", "100%"]),
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
              }}
            >
              {recipe.name}
            </h3>
            {/* Action count badge */}
            <span
              style={{
                flexShrink: 0,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "rgba(233,30,140,0.1)",
                border: "1px solid rgba(233,30,140,0.25)",
                color: "#e91e8c",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              {recipe.actionCount}{" "}
              {recipe.actionCount === 1 ? "action" : "actions"}
            </span>
          </div>
          <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.65 }}>
            {recipe.description}
          </p>
        </div>

        {/* Fee row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 0.75rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            style={{
              color: "#444",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Est. Fee
          </span>
          <span
            style={{
              color: "#888",
              fontSize: "0.78rem",
              fontFamily: "monospace",
            }}
          >
            {recipe.estimatedFee}
          </span>
        </div>

        {/* Status feedback */}
        {(done || error) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              background: done
                ? "rgba(29,185,84,0.08)"
                : "rgba(255,68,68,0.08)",
              border: `1px solid ${done ? "rgba(29,185,84,0.25)" : "rgba(255,68,68,0.25)"}`,
              color: done ? "#1db954" : "#ff5555",
              fontSize: "0.75rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {done ? "✓ Recipe executed successfully" : `✗ ${error}`}
          </motion.div>
        )}

        {/* Run button */}
        <div style={{ marginTop: "auto", position: "relative", zIndex: 1 }}>
          <SkeuoButton
            size="sm"
            onClick={handleRun}
            style={{
              width: "100%",
              justifyContent: "center",
              opacity: running ? 0.6 : 1,
            }}
          >
            {running ? (
              <span>Running...</span>
            ) : (
              <>
                <PlayIcon />
                <span>Run Recipe</span>
              </>
            )}
          </SkeuoButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
