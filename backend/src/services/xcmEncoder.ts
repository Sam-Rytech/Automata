import { ethers } from 'ethers'
import { Action } from '../types/Action'

// Moonbeam's Native Batch Precompile ABI
const BATCH_ABI = [
  'function batchAll(address[] to, uint256[] value, bytes[] callData, uint64[] gasLimit)',
]

export const encodeXcm = async (actions: Action[], api: unknown): Promise<string> => {
  const iface = new ethers.Interface(BATCH_ABI)

  // Map the frontend actions into the arrays the Batch Precompile expects
  const to = actions.map((a) => a.targetContract)
  const value = actions.map((a) => a.value || 0n)
  const callData = actions.map((a) => a.callData)
  const gasLimit = actions.map((a) => 0n) // 0 means pass all available gas to the sub-call

  // Encode the final payload that our Smart Contract will fire
  const payload = iface.encodeFunctionData('batchAll', [
    to,
    value,
    callData,
    gasLimit,
  ])

  return payload
}
