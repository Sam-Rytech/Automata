export type ActionType = 'SWAP' | 'BRIDGE' | 'STAKE' | 'TRANSFER'

export interface Action {
  id: string
  type: ActionType
  destinationParaId: number
  gasLimit: number
}

export interface Recipe {
  id: number
  name: string
  description: string
  actionCount: number
  estimatedFee: string
}

export interface ExecuteResponse {
  payload: string
  flowId: string
  estimatedFee: string
}

export interface SimulationResult {
  estimatedFee: string
  gasEstimate: string
  warnings: string[]
  safe: boolean
}

export interface HistoryEntry {
  flowId: string
  txHash: string
  timestamp: number
  actionCount: number
}