import { ApiPromise, WsProvider } from '@polkadot/api'
import dotenv from 'dotenv'

dotenv.config()

// Singleton instance
let apiInstance: ApiPromise | null = null
let isConnecting = false

export const getApi = async (): Promise<ApiPromise> => {
  // Return existing connection if valid
  if (apiInstance && apiInstance.isConnected) {
    return apiInstance
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    while (!apiInstance || !apiInstance.isConnected) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return apiInstance
  }

  isConnecting = true

  try {
    // Fallback to Moonbase Alpha if env var is missing
    const wsUrl =
      process.env.POLKADOT_WS_URL || 'wss://wss.api.moonbase.moonbeam.network'
    console.log(`🔌 Connecting to Polkadot node at ${wsUrl}...`)

    const provider = new WsProvider(wsUrl)
    apiInstance = await ApiPromise.create({ provider })

    // Fetch chain info to log on first connection
    const chain = await apiInstance.rpc.system.chain()
    console.log(`✅ Connected to: ${chain}`)

    // Handle reconnections
    apiInstance.on('disconnected', () => {
      console.warn(
        '⚠️ Disconnected from Polkadot node. Provider will attempt to auto-reconnect.'
      )
    })

    apiInstance.on('connected', () => {
      console.log('🔗 Reconnected to Polkadot node.')
    })

    isConnecting = false
    return apiInstance
  } catch (error) {
    isConnecting = false
    console.error('❌ Failed to connect to Polkadot node:', error)
    throw error
  }
}

// Quick manual test: uncomment the line below and run `npx ts-node src/utils/polkadotClient.ts`
getApi().then(() => process.exit(0));
