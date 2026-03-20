# Automata

**Cross-chain automation built on Polkadot. Drag, configure, execute — no XCM knowledge required.**

Automata is a visual flow builder that lets users compose multi-step cross-chain actions (Swap, Bridge, Stake, Transfer) and execute the entire sequence in a single transaction. Under the hood, the backend encodes actions into XCM v3 instructions and a Solidity contract on Moonbeam fires them at the blockchain via the native XCM precompile.

Built by **Velocity Labs**.

---

## What It Does

- **Visual Flow Builder** — drag action chips onto a canvas, chain them in any order, configure each one without touching XCM
- **One-Click Execution** — backend encodes your flow into XCM v3 bytes, contract fires them through Moonbeam's precompile
- **Recipes** — pre-built flows you can run in a single click
- **History** — every flow you've executed logged locally with explorer links

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion |
| Canvas | React Flow |
| Wallet | ethers.js v6 + MetaMask |
| Backend | Node.js + Express + TypeScript |
| XCM Encoding | @polkadot/api |
| Contracts | Solidity ^0.8.20 on Moonbeam / Moonbase Alpha |
| Protocol | XCM v3 via Moonbeam XCM Precompile |

---

## Monorepo Structure

```
Automata/
├── contracts/
│   ├── core/
│   │   ├── AutomataCore.sol        ← main entry point
│   │   └── IXcmPrecompile.sol      ← precompile interface
│   ├── registry/
│   │   └── RecipeRegistry.sol      ← predefined flows
│   ├── interfaces/
│   │   └── IRecipe.sol
│   └── utils/
│       ├── Errors.sol
│       └── Events.sol
│
├── backend/
│   └── src/
│       ├── api/
│       │   ├── execute.ts          ← POST /execute
│       │   ├── simulate.ts         ← POST /simulate
│       │   └── recipes.ts          ← GET /recipes
│       ├── services/
│       │   ├── xcmEncoder.ts       ← XCM encoding engine
│       │   ├── simulationService.ts
│       │   └── recipeService.ts
│       ├── types/
│       │   └── Action.ts
│       └── utils/
│           ├── polkadotClient.ts
│           └── helpers.ts
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx            ← landing page
│       │   ├── build/page.tsx      ← flow builder
│       │   ├── recipes/page.tsx    ← recipe browser
│       │   └── history/page.tsx    ← execution history
│       ├── components/
│       │   ├── ActionNode.tsx
│       │   ├── FlowBuilder.tsx
│       │   ├── ExecuteButton.tsx
│       │   ├── StatusPanel.tsx
│       │   ├── RecipeCard.tsx
│       │   ├── layout/
│       │   │   ├── nav-landing.tsx
│       │   │   ├── nav-app.tsx
│       │   │   └── nav-switcher.tsx
│       │   └── ui/
│       │       ├── skeuo-button.tsx
│       │       ├── reveal.tsx
│       │       └── spiral-animation.tsx
│       └── lib/
│           ├── api.ts
│           ├── contract.ts
│           ├── history.ts
│           └── types.ts
│
├── shared/
├── scripts/
│   └── deploy.ts
└── PROGRESS.md
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- DEV tokens on Moonbase Alpha — get them free at [faucet.moonbase.moonbeam.network](https://faucet.moonbase.moonbeam.network)

### 1. Clone and install

```bash
git clone https://github.com/your-org/automata.git
cd automata

# Install all workspaces
npm install
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:
```bash
POLKADOT_WS_URL=wss://wss.api.moonbase.moonbeam.network
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** — create `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESS=     # fill after deploying contracts
NEXT_PUBLIC_CHAIN_ID=1287
```

### 3. Start the backend

```bash
cd backend
npm run dev
# Server starts at http://localhost:3001
# Test: curl http://localhost:3001/health
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
# App starts at http://localhost:3000
```

### 5. Connect MetaMask

Open `http://localhost:3000`, click **Connect Wallet**. The app will automatically prompt you to switch to Moonbase Alpha (Chain ID: 1287). If the network isn't in your MetaMask yet, it will add it automatically.

---

## Deploying Contracts

### Prerequisites

- Hardhat configured for Moonbase Alpha
- A funded wallet with DEV tokens on Moonbase Alpha
- Private key set in environment

### 1. Set up deployer wallet

Create `contracts/.env`:
```bash
PRIVATE_KEY=your_private_key_here
MOONBASE_RPC=https://rpc.api.moonbase.moonbeam.network
MOONSCAN_API_KEY=your_moonscan_api_key  # optional, for verification
```

### 2. Compile contracts

```bash
cd contracts
npx hardhat compile
```

### 3. Deploy to Moonbase Alpha

```bash
npx hardhat run scripts/deploy.ts --network moonbase
```

This deploys in order:
1. `RecipeRegistry` — stores predefined XCM payloads
2. `AutomataCore` — main entry point, takes RecipeRegistry address in constructor

Deployment addresses are saved to `deployments.json`.

### 4. Verify on Moonscan (optional)

```bash
npx hardhat verify --network moonbase <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 5. Wire the frontend

Copy the `AutomataCore` address from `deployments.json` into `frontend/.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

Copy the ABI:
```bash
cp contracts/artifacts/contracts/core/AutomataCore.sol/AutomataCore.json frontend/src/abi/
```

Restart the frontend dev server. MetaMask will now show the correct contract address in the transaction popup.

---

## Deploying to Production

### Backend → Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Select the `backend/` directory as the root
3. Add environment variables from `backend/.env`
4. Railway auto-detects Node.js and deploys

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Or connect via the Vercel dashboard and set the root directory to `frontend/`.

Set these environment variables in Vercel:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=1287
```

### After deploying both

Test the full flow on production:
1. Open the Vercel URL
2. Connect MetaMask
3. Build a TRANSFER action
4. Simulate — fee estimate should appear
5. Execute — confirm in MetaMask
6. Check [moonbase.moonscan.io](https://moonbase.moonscan.io) for the `FlowExecuted` event

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `POLKADOT_WS_URL` | backend | Moonbase Alpha WebSocket RPC |
| `PORT` | backend | Express server port (default 3001) |
| `CORS_ORIGIN` | backend | Allowed frontend origin |
| `NEXT_PUBLIC_API_URL` | frontend | Backend base URL |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | frontend | Deployed AutomataCore address |
| `NEXT_PUBLIC_CHAIN_ID` | frontend | 1287 for Moonbase Alpha |
| `PRIVATE_KEY` | contracts | Deployer wallet private key |
| `MOONBASE_RPC` | contracts | Moonbase Alpha HTTP RPC |

---

## Deployed Contracts

| Contract | Network | Address |
|---|---|---|
| RecipeRegistry | Moonbase Alpha | TBD after deployment |
| AutomataCore | Moonbase Alpha | TBD after deployment |

---

## Useful Links

| Resource | URL |
|---|---|
| Moonbase Alpha Faucet | https://faucet.moonbase.moonbeam.network |
| Moonbase Alpha Explorer | https://moonbase.moonscan.io |
| Moonbeam XCM Docs | https://docs.moonbeam.network/builders/interoperability/xcm/ |
| Polkadot.js API | https://polkadot.js.org/docs/api |
| React Flow Docs | https://reactflow.dev/docs |

---

## Team

Built by **Velocity Labs** for the Polkadot hackathon.

| Role | Handles |
|---|---|
| Dev 1 | Smart Contracts + Backend |
| Dev 2 | Frontend |