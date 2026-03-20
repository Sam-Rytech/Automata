declare global { interface Window { ethereum?: any } }

import { BrowserProvider, Contract, parseEther } from 'ethers'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''
const CHAIN_ID = 1287 // Moonbase Alpha

// Placeholder ABI until Dev 1 deploys — replace with real AutomataCore.json
let ABI: any[] = []
try {
  ABI = require('@/abi/AutomataCore.json')
} catch {
  ABI = [
    'function execute(bytes calldata xcmPayload) external payable',
    'function executeRecipe(uint256 recipeId) external payable',
  ]
}

export async function getContract() {
  if (!window.ethereum) throw new Error('MetaMask not found')
  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return new Contract(CONTRACT_ADDRESS, ABI, signer)
}

export async function checkNetwork() {
  if (!window.ethereum) throw new Error('MetaMask not found')
  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  if (parseInt(chainId, 16) !== CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      })
    } catch {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${CHAIN_ID.toString(16)}`,
          chainName: 'Moonbase Alpha',
          nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
          rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
          blockExplorerUrls: ['https://moonbase.moonscan.io'],
        }],
      })
    }
  }
}

export async function executeFlow(payload: string) {
  await checkNetwork()
  const contract = await getContract()
  return contract.execute(payload, { value: parseEther('0.01') })
}

export async function executeRecipe(recipeId: number) {
  await checkNetwork()
  const contract = await getContract()
  return contract.executeRecipe(recipeId, { value: parseEther('0.01') })
}