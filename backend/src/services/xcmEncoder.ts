import { ApiPromise } from '@polkadot/api'
import { u8aToHex } from '@polkadot/util'
import { Action } from '../types/Action'
import { getApi } from '../utils/polkadotClient'

/**
 * Encodes an array of Actions into a SCALE-encoded XCM v3 message.
 * @param actions Array of actions configured by the user
 * @param api The active Polkadot API instance
 * @returns A hex string of the encoded XCM bytes
 */
export const encodeXcm = async (
  actions: Action[],
  api: ApiPromise
): Promise<string> => {
  const instructions: any[] = []

  for (const action of actions) {
    // We define the fee asset as the native token (parents: 0, interior: 'Here')
    const feeAsset = {
      id: { Concrete: { parents: 0, interior: 'Here' } },
      fun: { Fungible: action.value || 10000000000n }, // Fallback fee amount
    }

    // 1. WithdrawAsset: Pull the fees from the sender's account
    instructions.push({
      WithdrawAsset: [feeAsset],
    })

    // 2. BuyExecution: Buy computation time on the destination chain
    instructions.push({
      BuyExecution: {
        fees: feeAsset,
        weightLimit: {
          Limited: { refTime: action.gasLimit, proofSize: 65536n },
        },
      },
    })

    // 3. Transact: The actual contract call or system instruction
    instructions.push({
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: action.gasLimit, proofSize: 65536n },
        call: { encoded: action.callData },
      },
    })
  }

  // Wrap the instructions in the XcmVersionedXcm V3 format
  const xcmVersioned = api.createType('XcmVersionedXcm', {
    V3: instructions,
  })

  // Convert the SCALE-encoded bytes to a hex string
  return u8aToHex(xcmVersioned.toU8a())
}

// ==========================================
// STANDALONE TEST
// ==========================================
if (require.main === module) {
  ;(async () => {
    try {
      const api = await getApi()

      const testAction: Action = {
        type: 'TRANSFER',
        destinationParaId: 1000,
        targetContract: '0x0000000000000000000000000000000000000000',
        callData: '0x12345678', // Dummy encoded call
        gasLimit: 5000000000n,
      }

      console.log('⚙️  Encoding test action...')
      const payload = await encodeXcm([testAction], api)

      console.log('✅ Success! Encoded Payload:')
      console.log(payload)

      process.exit(0)
    } catch (error) {
      console.error('❌ Encoding failed:', error)
      process.exit(1)
    }
  })()
}
