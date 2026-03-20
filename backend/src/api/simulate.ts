import { Request, Response } from 'express'
import { simulate } from '../services/simulationService'
import { Action } from '../types/Action'

export const simulateHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { actions } = req.body as { actions: Action[] }

    if (!actions || !Array.isArray(actions)) {
      res.status(400).json({ error: 'Invalid actions array.' })
      return
    }

    const result = await simulate(actions)
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: 'Simulation failed', details: error.message })
  }
}
