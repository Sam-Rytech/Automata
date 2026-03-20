"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RecipeCard } from "@/components/RecipeCard";
import { SkeuoButton } from "@/components/ui/skeuo-button";
import { executeRecipe } from "@/lib/contract";
import type { Recipe } from "@/lib/types";

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "16px",
        background: "linear-gradient(145deg, #1c1c32, #141426)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem",
        height: "240px",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {[
        ["70%", "1rem"],
        ["100%", "0.75rem"],
        ["85%", "0.75rem"],
        ["40%", "2.5rem"],
      ].map(([w, h], i) => (
        <div
          key={i}
          style={{
            width: w,
            height: h,
            borderRadius: "6px",
            background: "rgba(255,255,255,0.04)",
            animation: `pulse-skeleton 1.8s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse-skeleton {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { getRecipes } = await import("@/lib/api");
      const data = await getRecipes();
      setRecipes(data);
    } catch {
      setError(
        "Could not reach backend — make sure it's running on port 3001.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRun = async (id: number) => {
    await executeRecipe(id);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        paddingTop: "56px",
      }}
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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 2.5rem 6rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "3.5rem" }}
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
            One-click flows
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
            Recipes
          </h1>
          <p
            style={{
              color: "#555",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              maxWidth: "480px",
            }}
          >
            Pre-built cross-chain flows. Pick one and execute in a single click
            — no configuration needed.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(255,68,68,0.08)",
                border: "1px solid rgba(255,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff5555"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p
              style={{
                color: "#555",
                fontSize: "0.88rem",
                maxWidth: "380px",
                lineHeight: 1.65,
              }}
            >
              {error}
            </p>
            <SkeuoButton size="sm" onClick={fetchRecipes}>
              Retry
            </SkeuoButton>
          </motion.div>
        ) : recipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "#333",
              fontSize: "0.88rem",
            }}
          >
            No recipes found from backend.
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {recipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i}
                onRun={handleRun}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
