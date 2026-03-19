export type Action = {
  type: 'SWAP' | 'BRIDGE' | 'STAKE' | 'TRANSFER';
  destinationParaId: number;      // e.g., 1000 for AssetHub, 2004 for Moonbeam
  targetContract: string;         // Address on the destination chain
  callData: string;               // ABI-encoded call hex string
  gasLimit: bigint;               // Computation limit for this specific step
  value?: bigint;                 // Optional native token amount to attach
};

export type ExecuteRequest = {
  actions: Action[];
  senderAddress: string;
};

export type ExecuteResponse = {
  payload: string;        // The final hex-encoded XCM bytes (e.g., "0xabc123...")
  flowId: string;         // Unique identifier for the flow
  estimatedFee: string;   // Estimated cross-chain execution fee
  actionCount: number;    // Number of actions bundled
};

export type SimulationResult = {
  success: boolean;
  estimatedFeeUSD: string;
  estimatedGas: string;
  warnings: string[];
  payloadSizeBytes: number;
};