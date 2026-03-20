import { Request, Response } from 'express'
import { randomBytes } from 'crypto'
import { encodeXcm } from '../services/xcmEncoder'
import { simulate } from '../services/simulationService'
import { getApi } from '../utils/polkadotClient'
import { ExecuteRequest, ExecuteResponse, Action } from '../types/Action'

export const executeHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { actions } = req.body as ExecuteRequest

    if (
      !actions ||
      !Array.isArray(actions) ||
      actions.length === 0 ||
      actions.length > 20
    ) {
      res
        .status(400)
        .json({ error: 'Invalid actions array. Must contain 1-20 actions.' })
      return
    }

    const parsedActions: Action[] = actions.map((action) => ({
      ...action,
      gasLimit: BigInt(action.gasLimit),
      value: action.value ? BigInt(action.value) : undefined,
    }))

    const api = await getApi()
    const payload = await encodeXcm(parsedActions, api)
    const simulation = await simulate(parsedActions)

    // Generate a random 32-byte flowId
    const flowId = '0x' + randomBytes(32).toString('hex')

    const response: ExecuteResponse = {
      payload,
      flowId,
      estimatedFee: simulation.estimatedFeeUSD,
      actionCount: parsedActions.length,
    }

    res.json(response)
  } catch (error: any) {
    console.error('Execute Error:', error)
    res
      .status(500)
      .json({ error: 'Failed to generate XCM payload', details: error.message })
  }
}
