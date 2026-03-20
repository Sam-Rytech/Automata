import type { Action, ExecuteResponse, SimulationResult, Recipe } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? 'Request failed')
  }
  return res.json()
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message ?? 'Request failed')
  }
  return res.json()
}

export const generatePayload = (actions: Action[]) =>
  post<ExecuteResponse>('/execute', { actions })

export const simulateFlow = (actions: Action[]) =>
  post<SimulationResult>('/simulate', { actions })

export const getRecipes = () =>
  get<Recipe[]>('/recipes')