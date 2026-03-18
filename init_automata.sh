#!/bin/bash

# 1. Create Root and Sub-folders
echo "🏗️ Creating Automata directory structure..."
mkdir -p contracts backend frontend shared

# 2. Initialize Root package.json
echo "📦 Initializing root workspace..."
cat <<EOF > package.json
{
  "name": "automata-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "contracts",
    "backend",
    "frontend"
  ],
  "scripts": {
    "contracts:compile": "npm run compile -w contracts",
    "backend:dev": "npm run dev -w backend",
    "frontend:dev": "npm run dev -w frontend"
  }
}
EOF

# 3. Initialize Contracts (Hardhat)
echo "📜 Setting up Contracts layer..."
cd contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
# Create a basic hardhat config so it's ready for TS
cat <<EOF > hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
EOF
mkdir contracts scripts test
cd ..

# 4. Initialize Backend (Node/TS)
echo "⚙️ Setting up Backend layer..."
cd backend
npm init -y
npm install express cors dotenv @polkadot/api @polkadot/util @polkadot/types
npm install -D typescript ts-node @types/express @types/node nodemon
npx tsc --init
mkdir -p src/api src/services src/types src/utils
cd ..

# 5. Initialize Frontend (Next.js 14)
echo "🎨 Initializing Frontend (Next.js)..."
# Using --non-interactive flags to prevent the script from stopping
npx create-next-app@latest frontend --typescript --tailwind --app --eslint --src-dir no --import-alias "@/*" --use-npm
cd frontend
npm install ethers framer-motion lucide-react
cd ..

echo "✅ Automata initialization complete!"
echo "Next step: Update your PROGRESS.md and let's start Phase 1 (Smart Contracts)."
