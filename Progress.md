# POLKAFLOW — PROGRESS.md
> **This is the single source of truth for the entire project.**
> Every LLM, every developer, every session starts here.
> This file is updated after every completed task — by the developer or the LLM.

---

## 🔴 HOW TO USE THIS FILE (READ FIRST — EVERY SESSION)

### If you are an LLM being handed this file:
1. Read the entire file before writing a single line of code
2. Find the section marked `## 📍 CURRENT POSITION` — that tells you exactly where we are
3. Find the next `[ ]` unchecked task under the active developer's section
4. Do that task and nothing else unless instructed
5. When done, output the diff/patch for the changed section so the developer can update this file
6. Format your patch like this:

```
--- PROGRESS.md PATCH ---
SECTION: [exact section heading]
CHANGE: [what changed]

OLD:
- [ ] Task description

NEW:
- [x] Task description
     STATUS: Complete
     DETAILS: What was built, what file, any decisions made, any gotchas
```

### If you are a developer updating this file:
1. Apply the LLM's patch to the relevant section
2. Update `## 📍 CURRENT POSITION` to reflect where you are now
3. Commit the updated PROGRESS.md with every code push
4. Message format for commit: `progress: [Dev1/Dev2] completed [task name]`

---

## 🧠 WHAT IS POLKAFLOW (NEVER SKIP THIS SECTION)

PolkaFlow is a **cross-chain automation platform built on Polkadot**. Think of it as Zapier for blockchains.

Users open the app, visually drag and drop actions (Swap, Bridge, Stake, Transfer) onto a canvas to compose a multi-step cross-chain flow, then execute the entire sequence in a single transaction. No XCM knowledge required.

**The magic:** Under the hood, the backend encodes those actions into XCM (Cross-Consensus Messages) — Polkadot's native protocol for communication between parachains — and a Solidity smart contract deployed on Moonbeam fires them at the blockchain via a built-in XCM precompile.

**Why it matters:** Today, executing cross-chain actions requires deep technical knowledge and multiple manual steps. PolkaFlow collapses that into a visual, one-click experience.

---

## 👥 THE TEAM

| Role | Handles | Machine |
|---|---|---|
| **Dev 1** | Smart Contracts + Backend | Separate machine, pushes to GitHub |
| **Dev 2** | Frontend | Separate machine, pushes to GitHub |

Both devs work simultaneously. Both push to the same GitHub repo. Both update this file after every completed task.

---

## 🏗️ FULL SYSTEM ARCHITECTURE

### The Three Layers

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  Next.js 14 (App Router) + Tailwind CSS             │
│  shadcn/ui · Framer Motion · React Flow             │
│                                                     │
│  Pages: / · /build · /recipes · /history            │
│  Key Components:                                    │
│    FlowBuilder   → drag-and-drop canvas             │
│    ActionNode    → individual action card           │
│    ExecuteButton → triggers the whole flow          │
│    StatusPanel   → shows tx state to user           │
│    RecipeCard    → one-click predefined flows       │
└──────────────────┬──────────────────────────────────┘
                   │ POST /execute
                   │ POST /simulate
                   │ GET  /recipes
                   ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
│  Node.js + Express + TypeScript                     │
│  @polkadot/api for XCM encoding                     │
│                                                     │
│  Key Files:                                         │
│    xcmEncoder.ts      → THE core engine             │
│    simulationService  → dry run + fee estimate      │
│    recipeService      → predefined flows            │
│    polkadotClient     → singleton WS connection     │
└──────────────────┬──────────────────────────────────┘
                   │ xcmPayload (hex bytes)
                   ▼
┌─────────────────────────────────────────────────────┐
│                SMART CONTRACTS                      │
│  Solidity ^0.8.20 on Moonbeam / Moonbase Alpha      │
│                                                     │
│  PolkaFlowCore.sol   → main entry point             │
│  RecipeRegistry.sol  → stores predefined payloads   │
│  IXcmPrecompile.sol  → interface to 0x...0801       │
└──────────────────┬──────────────────────────────────┘
                   │ XCM precompile call
                   ▼
┌─────────────────────────────────────────────────────┐
│                  BLOCKCHAIN                         │
│  Moonbeam → Polkadot Relay → Target Parachain       │
│  XCM v3 executes cross-chain instructions           │
└─────────────────────────────────────────────────────┘
```

### Data Flow (step by step)
1. User drags actions onto canvas and clicks Execute
2. Frontend sends `POST /execute` with `{ actions: Action[] }` to backend
3. Backend encodes actions → XCM v3 instructions → SCALE bytes → hex string
4. Backend returns `{ payload: "0x...", flowId, estimatedFee }`
5. Frontend calls `contract.execute(payload)` via ethers.js + MetaMask
6. Contract validates → calls XCM precompile at `0x0000000000000000000000000000000000000801`
7. XCM executes on target parachain
8. `FlowExecuted(user, flowId)` event emitted
9. Frontend reads event → StatusPanel shows SUCCESS + tx hash

---

## 📦 MONOREPO STRUCTURE

```
polkaflow/
├── contracts/
│   ├── core/
│   │   ├── PolkaFlowCore.sol         ← main contract
│   │   └── IXcmPrecompile.sol        ← precompile interface
│   ├── registry/
│   │   └── RecipeRegistry.sol        ← stores predefined flows
│   ├── interfaces/
│   │   └── IRecipe.sol
│   └── utils/
│       ├── Errors.sol
│       └── Events.sol
│
├── backend/
│   └── src/
│       ├── api/
│       │   ├── execute.ts            ← POST /execute
│       │   ├── simulate.ts           ← POST /simulate
│       │   └── recipes.ts            ← GET /recipes
│       ├── services/
│       │   ├── xcmEncoder.ts         ← XCM encoding engine (critical)
│       │   ├── simulationService.ts  ← fee estimation + dry run
│       │   └── recipeService.ts      ← hardcoded recipe definitions
│       ├── types/
│       │   └── Action.ts             ← shared TypeScript types
│       └── utils/
│           ├── polkadotClient.ts     ← singleton Polkadot WS connection
│           └── helpers.ts
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  ← landing page
│   │   ├── build/page.tsx            ← flow builder
│   │   ├── recipes/page.tsx          ← recipe browser
│   │   └── history/page.tsx          ← execution history
│   ├── components/
│   │   ├── FlowBuilder.tsx           ← React Flow canvas
│   │   ├── ActionNode.tsx            ← single action card
│   │   ├── ExecuteButton.tsx         ← execute trigger
│   │   ├── StatusPanel.tsx           ← tx state display
│   │   └── RecipeCard.tsx            ← recipe card
│   ├── lib/
│   │   ├── contract.ts               ← ethers.js contract calls
│   │   └── api.ts                    ← backend API calls
│   └── abi/
│       └── PolkaFlowCore.json        ← contract ABI (copied from contracts/)
│
├── shared/                           ← types shared across layers
├── scripts/
│   └── deploy.ts                     ← hardhat deploy script
├── PROGRESS.md                       ← THIS FILE
└── package.json                      ← monorepo root
```

---

## 🎨 UI LIBRARY DECISIONS

These are fixed. Do not change without updating this section.

| Library | Purpose | Version |
|---|---|---|
| **shadcn/ui** | Core UI components (buttons, cards, dialogs, dropdowns, toasts) | Latest |
| **Framer Motion** | Page transitions, component animations, micro-interactions | Latest |
| **React Flow** | The drag-and-drop flow builder canvas | Latest |
| **Tailwind CSS** | All styling, spacing, colors | v3 |
| **Lucide React** | Icons throughout the app | Latest |
| **next/font** | Font loading (display font TBD — NOT Inter/Arial/Roboto) | Built-in |

**Design direction:** Dark, deep space, DeFi-native. Primary background `#0F0F1A`. Accent pink `#E91E8C`. Purple `#6A0DAD`. Feels premium and technical. Animations are smooth and purposeful — not decorative noise.

**Font:** To be decided by Dev 2 during Step 3.1. Must be a distinctive display font. Suggestions: Syne, Cabinet Grotesk, Clash Display, General Sans. Final choice logged in this file once picked.

---

## 🔑 KEY TECHNICAL DECISIONS (LOG OF ALL DECISIONS MADE)

> Every significant technical decision is logged here. If an LLM or dev wants to change one of these, they must update this log with reasoning.

| Decision | Choice | Reason | Date |
|---|---|---|---|
| EVM chain for contracts | Moonbeam / Moonbase Alpha | Only EVM-compatible Polkadot parachain with native XCM precompile | Project start |
| XCM version | XCM v3 | Latest stable, supported by Moonbeam's precompile | Project start |
| Contract language | Solidity ^0.8.20 | EVM-compatible, familiar, Moonbeam supports it | Project start |
| Backend framework | Express + TypeScript | Lightweight, fast to build, good polkadot.js support | Project start |
| Frontend framework | Next.js 14 App Router | Best React framework, built-in API routes if needed | Project start |
| Flow builder library | React Flow | Purpose-built for node-based UIs, perfect fit for PolkaFlow | Project start |
| UI components | shadcn/ui | Unstyled base, easy to theme, no fighting the library | Project start |
| Wallet connection | ethers.js v6 BrowserProvider | Direct, no heavy abstraction layer needed | Project start |
| XCM fee asset | Native token (parents:0, Here) | Simplest approach for hackathon scope | Project start |

---

## 🌍 ENVIRONMENT VARIABLES REFERENCE

```bash
# backend/.env
POLKADOT_WS_URL=wss://wss.api.moonbase.moonbeam.network
PORT=3001
CORS_ORIGIN=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESS=                    ← filled after Step 2.5
NEXT_PUBLIC_CHAIN_ID=1287
```

---

## 🔗 DEPLOYED ADDRESSES

> Updated by Dev 1 after every deployment.

| Contract | Network | Address | Deployed At |
|---|---|---|---|
| RecipeRegistry | Moonbase Alpha | NOT YET DEPLOYED | — |
| PolkaFlowCore | Moonbase Alpha | NOT YET DEPLOYED | — |

---

## 📍 CURRENT POSITION

```
PHASE:   1 — Setup & Scaffold
STEP:    1.1 — Create the monorepo
STATUS:  NOT STARTED

Dev 1 is working on: Nothing yet
Dev 2 is working on: Nothing yet

Last update: [timestamp of last commit]
Next sync checkpoint: End of Phase 1
```

> This block is updated after every single task completes.
> Any LLM reading this knows exactly where to pick up.

---
---

# ═══════════════════════════════════════════
# PHASE 1 — SETUP & SCAFFOLD
# Both devs together · Est. 2–3 hours
# ═══════════════════════════════════════════
> Goal: Both devs have a running local environment. Monorepo exists. Everything installs and compiles. Nothing broken.

---

## PHASE 1 — DEV 1 TASKS

### Step 1.1 — Create monorepo and contracts workspace
- [ ] Create root `polkaflow/` folder
- [ ] Add root `package.json` with workspaces: `["contracts", "backend", "frontend"]`
- [ ] Create folders: `contracts/`, `backend/`, `frontend/`, `shared/`, `scripts/`
- [ ] Add `.gitignore` at root covering: `node_modules`, `.env`, `.env.local`, `dist`, `artifacts`, `cache`
- [ ] Run `git init`, create GitHub repo, push initial commit
- [ ] `cd contracts && npx hardhat init` (choose TypeScript)
- [ ] Install: `npm install -D hardhat @nomicfoundation/hardhat-toolbox && npm install @openzeppelin/contracts`
- [ ] Configure `hardhat.config.ts` for Moonbase Alpha (RPC: `https://rpc.api.moonbase.moonbeam.network`, chainId: 1287)
- [ ] Run `npx hardhat compile` — must exit 0

```
DONE WHEN: npx hardhat compile succeeds. Repo is on GitHub.
```

### Step 1.2 — Initialize backend workspace
- [ ] `cd backend && npm init -y`
- [ ] Install runtime: `npm install express cors dotenv @polkadot/api @polkadot/util @polkadot/types`
- [ ] Install dev: `npm install -D typescript ts-node nodemon @types/express @types/node`
- [ ] Create `tsconfig.json` (target ES2020, module commonjs, strict true, outDir dist)
- [ ] Create `src/index.ts` — Express app, `/health` route returning `{ status: "ok" }`, listen on `process.env.PORT ?? 3001`
- [ ] Add `package.json` scripts: `"dev": "nodemon src/index.ts"`, `"build": "tsc"`
- [ ] Run `npm run dev` — server starts without errors

```
DONE WHEN: curl http://localhost:3001/health returns { "status": "ok" }
```

---

## PHASE 1 — DEV 2 TASKS

### Step 1.3 — Initialize frontend workspace
- [ ] Run: `npx create-next-app@latest frontend --typescript --tailwind --app --no-git`
- [ ] Install: `npm install framer-motion lucide-react reactflow`
- [ ] Install shadcn: `npx shadcn-ui@latest init` (choose dark theme, slate base color)
- [ ] Install shadcn components needed: `npx shadcn-ui@latest add button card badge toast dialog tooltip`
- [ ] Create `frontend/.env.local` with all placeholder env vars (see Environment Variables section)
- [ ] Delete the default Next.js boilerplate from `app/page.tsx` — replace with `<h1>PolkaFlow</h1>`
- [ ] Run `npm run dev` — loads at localhost:3000 with no errors

```
DONE WHEN: localhost:3000 shows "PolkaFlow" heading. Zero console errors.
```

---

## PHASE 1 — SYNC CHECKPOINT ⬛
> Do not move to Phase 2 until all boxes below are checked by both devs.

- [ ] Dev 1: `npx hardhat compile` passes
- [ ] Dev 1: `curl localhost:3001/health` returns OK
- [ ] Dev 2: `localhost:3000` loads with no errors
- [ ] Dev 2: shadcn components install without errors
- [ ] Both: Same GitHub repo, both have pushed at least one commit
- [ ] Both: Updated `## 📍 CURRENT POSITION` to Phase 2

---
---

# ═══════════════════════════════════════════
# PHASE 2 — CONTRACTS + BACKEND
# Dev 1 leads · Dev 2 can start Phase 3 in parallel
# ═══════════════════════════════════════════
> Goal: Contracts deployed to Moonbase Alpha. Backend API returns real XCM-encoded payloads.

---

## PHASE 2 — DEV 1 TASKS

### Step 2.1 — Errors.sol and Events.sol
- [ ] Create `contracts/utils/Errors.sol` with: `InvalidPayload`, `ExecutionFailed`, `AlreadyExecuted`, `RecipeNotFound`, `Unauthorized`
- [ ] Create `contracts/utils/Events.sol` with: `FlowExecuted(address indexed user, bytes32 indexed flowId)`, `RecipeExecuted(uint256 indexed recipeId, address indexed user)`
- [ ] `npx hardhat compile` — must pass

```
DONE WHEN: compile passes. Files exist at correct paths.
DETAILS TO LOG: nothing unexpected expected here.
```

### Step 2.2 — IXcmPrecompile.sol
- [ ] Create `contracts/core/IXcmPrecompile.sol`
- [ ] Interface must include: `execute(bytes calldata) external returns (bool)` and `sendXcm(uint32, bytes calldata) external returns (bool)`
- [ ] Compile — must pass

```
DONE WHEN: Interface compiles cleanly.
```

### Step 2.3 — RecipeRegistry.sol
- [ ] Create `contracts/registry/RecipeRegistry.sol`
- [ ] Storage: `mapping(uint256 => bytes) public recipes`, `mapping(uint256 => string) public recipeNames`, `uint256 public recipeCount`
- [ ] Functions: `registerRecipe(string, bytes) onlyOwner returns (uint256)`, `getRecipe(uint256) view returns (bytes)`, `getAllRecipeNames() view returns (string[])`
- [ ] Write `test/RecipeRegistry.test.ts` — register one recipe, read it back, assert payload matches
- [ ] `npx hardhat test` — must pass

```
DONE WHEN: Tests pass. Contract logic is correct.
```

### Step 2.4 — PolkaFlowCore.sol
- [ ] Create `contracts/core/PolkaFlowCore.sol`
- [ ] Constructor takes `address _recipeRegistry`
- [ ] Implement `execute(bytes calldata xcmPayload) external payable` — full logic (validate, flowId, replay check, precompile call, mark executed, emit event)
- [ ] Implement `executeRecipe(uint256 recipeId) external payable`
- [ ] Write mock XCM precompile for tests: always returns true
- [ ] Write `test/PolkaFlowCore.test.ts` — test execute(), test replay protection, test empty payload revert, test recipe execution
- [ ] `npx hardhat test` — all tests pass

```
DONE WHEN: All tests pass. execute() and executeRecipe() fully implemented.
```

### Step 2.5 — Deploy to Moonbase Alpha
- [ ] Get testnet GLMR from faucet: https://faucet.moonbase.moonbeam.network
- [ ] Create `scripts/deploy.ts` — deploys RecipeRegistry first, then PolkaFlowCore with registry address
- [ ] Run: `npx hardhat run scripts/deploy.ts --network moonbase`
- [ ] Save addresses to `deployments.json` in repo root
- [ ] Copy ABI files from `contracts/artifacts/` to `frontend/src/abi/`
- [ ] Update `## 🔗 DEPLOYED ADDRESSES` table in this file with real addresses

```
DONE WHEN: Both contracts live on Moonbase Alpha. Addresses in deployments.json. ABI in frontend/src/abi/.
```

### Step 2.6 — types/Action.ts
- [ ] Create `backend/src/types/Action.ts`
- [ ] Define: `Action` type, `ExecuteRequest` type, `ExecuteResponse` type, `SimulationResult` type
- [ ] Full type definitions:
  ```
  Action {
    type: 'SWAP' | 'BRIDGE' | 'STAKE' | 'TRANSFER'
    destinationParaId: number
    targetContract: string
    callData: string
    gasLimit: bigint
    value?: bigint
  }
  ```

```
DONE WHEN: TypeScript compiles with zero errors referencing Action.ts.
```

### Step 2.7 — polkadotClient.ts
- [ ] Create `backend/src/utils/polkadotClient.ts`
- [ ] Singleton pattern: one `ApiPromise` instance, reused across all requests
- [ ] Connects to `process.env.POLKADOT_WS_URL`
- [ ] Logs chain name on first connection
- [ ] Handles reconnection if disconnected

```
DONE WHEN: Running the file logs "Connected to: Moonbase Alpha" (or similar chain name).
```

### Step 2.8 — xcmEncoder.ts (CRITICAL — most complex file)
- [ ] Create `backend/src/services/xcmEncoder.ts`
- [ ] Import: `ApiPromise` from `@polkadot/api`, `u8aToHex` from `@polkadot/util`
- [ ] Implement `encodeXcm(actions: Action[], api: ApiPromise): Promise<string>`
- [ ] For each action build three XCM instructions:
  - `WithdrawAsset` — uses `{ parents: 0, interior: 'Here' }` as asset location
  - `BuyExecution` — `WeightLimit.Limited` with action's gasLimit
  - `Transact` — `originType: SovereignAccount`, `requireWeightAtMost: { refTime: gasLimit, proofSize: 65536n }`, `call: { encoded: callData }`
- [ ] Encode with: `api.createType('XcmVersionedXcm', { V3: instructions })`
- [ ] Return: `u8aToHex(xcmVersioned.toU8a())`
- [ ] Write standalone test: encode one TRANSFER action, verify output starts with `0x` and is non-empty

```
DONE WHEN: Test produces a hex string starting with 0x for a TRANSFER action. This is the hardest step — do not rush it.
```

### Step 2.9 — simulationService.ts
- [ ] Create `backend/src/services/simulationService.ts`
- [ ] Implement `simulate(actions: Action[]): Promise<SimulationResult>`
- [ ] Checks: payload size warning if > 64KB, action count warning if > 10
- [ ] Calculates: total gas = sum of all gasLimits + 20% buffer
- [ ] Returns: `{ success, estimatedFeeUSD, estimatedGas, warnings[], payloadSizeBytes }`

```
DONE WHEN: simulate([oneTransferAction]) returns object with success:true and no warnings.
```

### Step 2.10 — recipeService.ts
- [ ] Create `backend/src/services/recipeService.ts`
- [ ] Hardcode 3 recipes:
  - ID 0: "DOT Transfer" — single TRANSFER action to AssetHub (paraId 1000)
  - ID 1: "DOT Swap" — SWAP action
  - ID 2: "Stake & Earn" — STAKE action
- [ ] Export: `getRecipes()` returns all, `getRecipeById(id)` returns one

```
DONE WHEN: getRecipes() returns array of 3. getRecipeById(0) returns the DOT Transfer recipe.
```

### Step 2.11 — API routes
- [ ] Create `backend/src/api/execute.ts` — POST /execute:
  - Validate: actions array exists, is non-empty, length ≤ 20
  - Call `encodeXcm()` → return `{ payload, flowId, estimatedFee, actionCount }`
- [ ] Create `backend/src/api/simulate.ts` — POST /simulate:
  - Call `simulate()` → return result
- [ ] Create `backend/src/api/recipes.ts` — GET /recipes:
  - Return `getRecipes()` as JSON
- [ ] Wire all routes in `src/index.ts`
- [ ] Test all routes manually with curl or Postman

```
DONE WHEN:
  POST /execute with { actions: [{ type: 'TRANSFER', ... }] } → returns hex payload
  POST /execute with { actions: [] } → returns HTTP 400
  POST /simulate → returns SimulationResult
  GET /recipes → returns array of 3 recipes
```

---

## PHASE 2 — SYNC CHECKPOINT ⬛
- [ ] Dev 1: All Hardhat tests pass
- [ ] Dev 1: Both contracts deployed, `deployments.json` committed to repo
- [ ] Dev 1: ABI files copied to `frontend/src/abi/`
- [ ] Dev 1: `POST /execute` with a TRANSFER action returns a valid hex string
- [ ] Dev 1: Shared contract address and ABI with Dev 2 (via repo)
- [ ] Dev 2: Confirmed ABI files received and placed correctly
- [ ] Both: Updated `## 📍 CURRENT POSITION` to Phase 3/4

---
---

# ═══════════════════════════════════════════
# PHASE 3 — FRONTEND
# Dev 2 leads · Starts after Phase 1 sync
# ═══════════════════════════════════════════
> Goal: Complete, polished UI. All components built. Wallet connects. Ready for integration.

---

## PHASE 3 — DEV 2 TASKS

### Step 3.1 — Design system and global layout
- [ ] Define CSS variables in `app/globals.css`:
  ```css
  --bg-primary: #0F0F1A;
  --bg-secondary: #1A1A2E;
  --bg-card: #16213E;
  --accent-pink: #E91E8C;
  --accent-purple: #6A0DAD;
  --accent-glow: rgba(233, 30, 140, 0.3);
  --text-primary: #FFFFFF;
  --text-muted: #888888;
  --border-subtle: rgba(255,255,255,0.08);
  ```
- [ ] Choose and install display font via `next/font` — must NOT be Inter, Arial, or Roboto
- [ ] Log chosen font here once decided: `FONT CHOSEN: ___________`
- [ ] Create `app/layout.tsx`:
  - Dark background matching `--bg-primary`
  - Top nav: PolkaFlow logo left, nav links (Build, Recipes, History) center, wallet button right
  - Framer Motion `AnimatePresence` wrapper for page transitions
- [ ] Create reusable `components/ui/WalletButton.tsx`:
  - Shows "Connect Wallet" if disconnected
  - Shows truncated address if connected
  - On click: calls `window.ethereum.request({ method: 'eth_requestAccounts' })`

```
DONE WHEN: All pages share nav. Font renders. Wallet button visible. Page transitions animate.
```

### Step 3.2 — Landing page (/)
- [ ] Hero section:
  - Large display-font headline: "Cross-Chain Flows. One Click."
  - Subheadline: one sentence explaining PolkaFlow
  - Two CTA buttons using shadcn Button: "Start Building" (→ /build) and "Browse Recipes" (→ /recipes)
  - Animated background using Framer Motion or CSS: gradient mesh or floating orbs
- [ ] Feature cards section — 3 shadcn Cards:
  - "Visual Flow Builder" — drag-drop canvas
  - "XCM Powered" — Polkadot native
  - "One-Click Execute" — no technical knowledge needed
- [ ] Animate cards in with staggered Framer Motion `fadeInUp` on scroll
- [ ] Footer: project name + "Built on Polkadot"

```
DONE WHEN: Page looks genuinely impressive. Animations run smoothly. CTA buttons navigate correctly.
```

### Step 3.3 — lib/api.ts
- [ ] Create `frontend/src/lib/api.ts`
- [ ] Implement:
  - `generatePayload(actions: Action[]): Promise<ExecuteResponse>` → POST /execute
  - `simulateFlow(actions: Action[]): Promise<SimulationResult>` → POST /simulate
  - `getRecipes(): Promise<Recipe[]>` → GET /recipes
- [ ] All functions: throw Error with server's error message on non-2xx response
- [ ] Use `process.env.NEXT_PUBLIC_API_URL` as base URL

```
DONE WHEN: Calling getRecipes() from browser console returns the 3 recipes from backend.
```

### Step 3.4 — lib/contract.ts
- [ ] Create `frontend/src/lib/contract.ts`
- [ ] Import ABI from `src/abi/PolkaFlowCore.json`
- [ ] `getContract()` — BrowserProvider from window.ethereum, getSigner, return Contract instance
- [ ] `checkNetwork()` — verify chainId is 1287 (Moonbase Alpha), prompt switch if not
- [ ] `executeFlow(payload: string)` — calls `contract.execute(payload, { value: parseEther('0.01') })`
- [ ] `executeRecipe(recipeId: number)` — calls `contract.executeRecipe(recipeId, { value: parseEther('0.01') })`

```
DONE WHEN: Calling executeFlow('0x') triggers a MetaMask popup (even if it reverts — that's fine).
```

### Step 3.5 — ActionNode component
- [ ] Create `frontend/src/components/ActionNode.tsx`
- [ ] Uses React Flow's custom node API (`NodeProps`)
- [ ] Renders shadcn Card with:
  - Action type badge (color coded: SWAP=pink, BRIDGE=purple, STAKE=green, TRANSFER=blue)
  - Destination parachain dropdown (shadcn Select): AssetHub (1000), Moonbeam (2004), Custom
  - Gas limit input (shadcn Input)
  - Delete button (Lucide `Trash2` icon)
  - React Flow handles (source bottom, target top) for connection lines
- [ ] Subtle Framer Motion entrance animation (fade + slide up)

```
DONE WHEN: Node renders correctly inside React Flow canvas with handles visible. Delete fires onDelete.
```

### Step 3.6 — FlowBuilder component
- [ ] Create `frontend/src/components/FlowBuilder.tsx`
- [ ] Use React Flow `ReactFlow` component as the canvas
- [ ] Left panel — action palette:
  - 4 draggable cards (SWAP, BRIDGE, STAKE, TRANSFER)
  - Each has Lucide icon, label, color-coded left border
  - Drag onto canvas OR click to append
- [ ] Canvas behavior:
  - Dropping an action card creates a new `ActionNode`
  - Nodes auto-connect top-to-bottom with animated edges
  - Empty state overlay: "Drag an action here to start your flow"
  - MiniMap in bottom right corner
  - Controls (zoom in/out, fit view) in bottom left
- [ ] Exports current `actions: Action[]` to parent via `onChange` prop on every node update

```
DONE WHEN: Can drag 3 actions onto canvas, configure each independently, delete one, and parent receives correct actions array.
```

### Step 3.7 — StatusPanel component
- [ ] Create `frontend/src/components/StatusPanel.tsx`
- [ ] Accepts: `status: 'idle' | 'encoding' | 'pending' | 'success' | 'error'`, `message?: string`, `txHash?: string`
- [ ] Renders with Framer Motion `AnimatePresence` for smooth state transitions:
  - **idle** — muted text "Build a flow above to get started"
  - **encoding** — animated spinner (Framer Motion rotate) + "Encoding XCM payload..."
  - **pending** — animated spinner + "Waiting for blockchain confirmation..."
  - **success** — green glow effect + checkmark + "Flow executed!" + copyable truncated tx hash + link to Moonbase Alpha explorer
  - **error** — red border + X icon + error message
- [ ] Each state transition animates in smoothly

```
DONE WHEN: All 5 states render and animate correctly when status prop is changed manually in Storybook or a test page.
```

### Step 3.8 — ExecuteButton component
- [ ] Create `frontend/src/components/ExecuteButton.tsx`
- [ ] Accepts: `actions: Action[]`, `onStatusChange: (status, message?, txHash?) => void`
- [ ] On click executes this exact sequence:
  1. `onStatusChange('encoding')` → call `generatePayload(actions)`
  2. `onStatusChange('pending')` → call `executeFlow(payload)` → `await tx.wait()`
  3. `onStatusChange('success', undefined, tx.hash)`
  4. On any error: `onStatusChange('error', err.message)`
- [ ] Button: disabled if actions empty OR loading, gradient pink→purple, Framer Motion scale on hover
- [ ] Loading state: Lucide `Loader2` spinning icon + "Executing..."

```
DONE WHEN: Button correctly cycles through all status states. Disabled with empty actions array.
```

### Step 3.9 — Build page (/build)
- [ ] Create `app/build/page.tsx`
- [ ] State: `actions`, `status`, `statusMessage`, `txHash`
- [ ] Layout (full viewport height):
  - Page header: "Flow Builder" title + subtitle
  - `FlowBuilder` canvas — takes up most of the page height
  - Bottom bar: Simulate button (left) + `ExecuteButton` (right)
  - `StatusPanel` below the bottom bar
- [ ] Simulate button: calls `simulateFlow(actions)`, shows result in shadcn Dialog:
  - Estimated fee
  - Gas estimate
  - Warnings list (if any)
  - "Looks good" / "Proceed with caution" verdict

```
DONE WHEN: Full page renders. FlowBuilder fills the screen. Simulate dialog opens with data. Execute button wired to StatusPanel.
```

### Step 3.10 — Recipes page (/recipes)
- [ ] Create `frontend/src/components/RecipeCard.tsx`:
  - shadcn Card with recipe name, description, action count badge, estimated fee
  - "Run Recipe" button → calls `executeRecipe(id)` → shows toast notification (shadcn Toast) with result
  - Framer Motion hover: subtle lift + glow effect
- [ ] Create `app/recipes/page.tsx`:
  - Fetches recipes from `getRecipes()` on mount
  - Loading state: 3 skeleton cards (shadcn Skeleton)
  - Grid of `RecipeCard` components (3 columns on desktop, 1 on mobile)
  - Page header with title and description

```
DONE WHEN: /recipes shows 3 recipe cards with real data. Run Recipe triggers MetaMask popup.
```

### Step 3.11 — History page (/history)
- [ ] Create `app/history/page.tsx`
- [ ] On every successful execution: save to localStorage `polkaflow_history` array:
  ```json
  { "flowId": "0x...", "txHash": "0x...", "timestamp": 1234567890, "actionCount": 2 }
  ```
- [ ] Render shadcn Table with columns: Flow ID (truncated), Actions, Time (relative), Status, Explorer Link
- [ ] Empty state: illustration + "No flows executed yet — start building!" + link to /build

```
DONE WHEN: After running a flow on /build, it appears in the /history table with correct tx hash.
```

---

## PHASE 3 — SYNC CHECKPOINT ⬛
- [ ] Dev 2: All pages load without errors
- [ ] Dev 2: FlowBuilder adds, configures, deletes actions correctly
- [ ] Dev 2: MetaMask connects, network check works (prompts switch to Moonbase Alpha)
- [ ] Dev 2: Recipes page shows real data from backend
- [ ] Dev 2: All 5 StatusPanel states render and animate
- [ ] Dev 1: ABI files confirmed in `frontend/src/abi/` and contract address in `.env.local`
- [ ] Both: Updated `## 📍 CURRENT POSITION` to Phase 4

---
---

# ═══════════════════════════════════════════
# PHASE 4 — INTEGRATION
# Both devs together
# ═══════════════════════════════════════════
> Goal: Full end-to-end flow works on Moonbase Alpha. Real transaction. Real event. Real explorer link.

---

### Step 4.1 — Connect frontend to deployed contract
- [ ] Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with address from `deployments.json`
- [ ] Verify `lib/contract.ts` instantiates the correct contract
- [ ] MetaMask popup must show correct contract address

```
DONE WHEN: MetaMask shows PolkaFlowCore contract address in the transaction popup.
```

### Step 4.2 — Full end-to-end test: TRANSFER action
- [ ] Open /build, add one TRANSFER action, configure destinationParaId: 1000
- [ ] Click Simulate — fee estimate appears in dialog
- [ ] Click Execute — MetaMask popup appears
- [ ] Confirm in MetaMask
- [ ] StatusPanel transitions: encoding → pending → success
- [ ] StatusPanel shows tx hash
- [ ] Open Moonbase Alpha explorer (https://moonbase.moonscan.io) — transaction exists
- [ ] Transaction logs show `FlowExecuted` event with correct user address

```
DONE WHEN: FlowExecuted event visible on Moonbase Alpha explorer. Both devs have witnessed this.
```

### Step 4.3 — Full end-to-end test: Recipe execution
- [ ] Go to /recipes
- [ ] Click "Run Recipe" on Recipe 0 (DOT Transfer)
- [ ] Confirm MetaMask
- [ ] Toast notification shows success
- [ ] Explorer shows `RecipeExecuted` event

```
DONE WHEN: RecipeExecuted event visible on explorer.
```

### Step 4.4 — Error handling tests
- [ ] Reject MetaMask transaction → StatusPanel shows "User rejected the request"
- [ ] Backend unreachable → StatusPanel shows "Failed to generate payload"
- [ ] Wrong network → app shows "Please switch to Moonbase Alpha" — no crash

```
DONE WHEN: All 3 error paths show clean readable messages. No raw errors or stack traces visible.
```

### Step 4.5 — Cross-browser test
- [ ] Chrome + MetaMask ✓
- [ ] Brave + built-in wallet ✓
- [ ] Zero console errors on either browser ✓

```
DONE WHEN: App works cleanly on at least 2 browsers.
```

---

## PHASE 4 — SYNC CHECKPOINT ⬛
- [ ] Full TRANSFER flow works: UI → backend → contract → blockchain → explorer
- [ ] Full recipe execution works
- [ ] All error states show clean messages
- [ ] Both devs witnessed full demo working on their own machines
- [ ] Commit everything to main with message: `feat: full end-to-end integration working`

---
---

# ═══════════════════════════════════════════
# PHASE 5 — POLISH & SHIP
# Both devs together
# ═══════════════════════════════════════════
> Goal: Demo-ready. Looks great. Runs clean. Tells its story in under 3 minutes.

---

### Step 5.1 — UI polish pass
- [ ] Loading skeletons on every async data fetch
- [ ] Hover animations on all interactive elements
- [ ] Flow builder canvas has glowing node effects and animated edge lines
- [ ] Success state triggers a Framer Motion confetti or particle burst
- [ ] App looks good at 1280px, 1440px, and 1920px

### Step 5.2 — Code cleanup
- [ ] Remove all `console.log` from production code
- [ ] No hardcoded secrets or private keys anywhere
- [ ] Backend rate limiting: max 20 requests/min per IP
- [ ] CORS restricted to frontend origin only
- [ ] `.env` files confirmed in `.gitignore`

### Step 5.3 — README.md
- [ ] What PolkaFlow is (3 sentences)
- [ ] How to run locally (exact commands)
- [ ] How to deploy contracts
- [ ] Environment variable reference
- [ ] Team members

### Step 5.4 — Demo script (practice until flawless)
- [ ] Open `/` → 15 second pitch
- [ ] Go to `/build` → drag 2 actions → simulate → execute → show explorer
- [ ] Go to `/recipes` → run one recipe in one click
- [ ] Go to `/history` → show executed flows
- [ ] Full demo under 3 minutes, works perfectly twice in a row

### Step 5.5 — Deploy (optional but recommended)
- [ ] Backend → Railway or Render
- [ ] Frontend → Vercel
- [ ] Update frontend env with production backend URL
- [ ] Full end-to-end test on live URLs

---

## 🏁 FINAL SHIP CHECKLIST
> Every box must be checked before calling this done.

- [ ] Contracts deployed and verified on Moonbase Alpha
- [ ] `POST /execute` returns valid hex for a TRANSFER action
- [ ] `GET /recipes` returns 3 recipes
- [ ] FlowBuilder canvas works — drag, configure, delete
- [ ] ExecuteButton triggers correct status transitions
- [ ] Full TRANSFER flow executes with `FlowExecuted` event on chain
- [ ] Recipe execution works with `RecipeExecuted` event on chain
- [ ] All error states show clean messages
- [ ] History page logs past executions
- [ ] README complete and accurate
- [ ] No secrets in git history
- [ ] Demo practiced and under 3 minutes

---

## 🔗 USEFUL LINKS (QUICK REFERENCE)

| Resource | URL |
|---|---|
| Moonbase Alpha Faucet | https://faucet.moonbase.moonbeam.network |
| Moonbase Alpha Explorer | https://moonbase.moonscan.io |
| Moonbeam XCM Docs | https://docs.moonbeam.network/builders/interoperability/xcm/ |
| Polkadot.js API Docs | https://polkadot.js.org/docs/api |
| React Flow Docs | https://reactflow.dev/docs |
| shadcn/ui Docs | https://ui.shadcn.com |
| Hardhat Docs | https://hardhat.org/docs |

---

*This file is the project. Keep it updated. Every session starts here.*