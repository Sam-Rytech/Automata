import { Action } from '../types/Action'

export type Recipe = {
  id: number
  name: string
  description: string
  actions: Action[]
}

const recipes: Recipe[] = [
  {
    id: 0,
    name: 'Testnet Transfer',
    description: 'Actually moves 0.001 DEV to the dead address.',
    actions: [
      {
        type: 'TRANSFER',
        destinationParaId: 2004,
        targetContract: '0x000000000000000000000000000000000000dEaD', // Test burn address
        callData: '0x', // Empty call data because we are just sending native tokens
        value: 1000000000000000n, // 0.001 DEV in Wei
        gasLimit: 5000000000n,
      },
    ],
  },
  {
    id: 1,
    name: 'DOT Swap',
    description: 'Swap tokens on a decentralized exchange on Moonbeam.',
    actions: [
      {
        type: 'SWAP',
        destinationParaId: 2004,
        targetContract: '0x0000000000000000000000000000000000000000',
        callData: '0x5678',
        gasLimit: 8000000000n,
      },
    ],
  },
  {
    id: 2,
    name: 'Stake & Earn',
    description: 'Automatically stake native tokens for yield.',
    actions: [
      {
        type: 'STAKE',
        destinationParaId: 2004,
        targetContract: '0x0000000000000000000000000000000000000000',
        callData: '0x9abc',
        gasLimit: 6000000000n,
      },
    ],
  },
]

export const getRecipes = (): Recipe[] => {
  return recipes
}

export const getRecipeById = (id: number): Recipe | undefined => {
  return recipes.find((r) => r.id === id)
}
