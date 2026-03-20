import { Action, SimulationResult } from '../types/Action'

/**
 * Simulates a flow to estimate fees and check for warnings.
 * (In a production environment, this would call RPC endpoints for exact state estimations.
 * For this hackathon, we apply robust heuristics based on the action parameters).
 */
export const simulate = async (
  actions: Action[]
): Promise<SimulationResult> => {
  const warnings: string[] = []
  let totalGasLimit = 0n

  // 1. Check constraints
  if (actions.length > 10) {
    warnings.push(
      'High action count: Flows with more than 10 actions may exceed XCM message size limits.'
    )
  }

  // 2. Calculate gas
  for (const action of actions) {
    totalGasLimit += action.gasLimit
  }

  // Add 20% safety buffer for execution overhead
  const safeGasEstimate = (totalGasLimit * 120n) / 100n

  // 3. Estimate Fee in USD (Heuristic: 1 billion gas ~= $0.05 on testnet equivalents)
  const gasInBillions = Number(safeGasEstimate) / 1_000_000_000
  const estimatedFeeUSD = (gasInBillions * 0.05).toFixed(4)

  // 4. Estimate Payload Size (Heuristic: ~150 bytes per action)
  const payloadSizeBytes = actions.length * 150
  if (payloadSizeBytes > 65536) {
    // 64KB
    warnings.push(
      'Payload size warning: Estimated payload exceeds 64KB XCM limit.'
    )
  }

  return {
    success: true, // Assuming simulation passes for the hackathon scope
    estimatedFeeUSD: `$${estimatedFeeUSD}`,
    estimatedGas: safeGasEstimate.toString(),
    warnings,
    payloadSizeBytes,
  }
}
