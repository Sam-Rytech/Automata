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
    name: 'DOT Transfer',
    description: 'Instantly transfer DOT to AssetHub via XCM.',
    actions: [
      {
        type: 'TRANSFER',
        destinationParaId: 1000, // AssetHub
        targetContract: '0x0000000000000000000000000000000000000000',
        callData: '0x1234', // Dummy call data for the hackathon
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
        destinationParaId: 2004, // Moonbeam
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