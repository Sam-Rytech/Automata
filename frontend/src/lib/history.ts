import type { HistoryEntry } from './types'

const KEY = 'Automata_history'

export function saveToHistory(entry: HistoryEntry) {
  if (typeof window === 'undefined') return
  const existing: HistoryEntry[] = JSON.parse(localStorage.getItem(KEY) ?? '[]')
  localStorage.setItem(KEY, JSON.stringify([entry, ...existing].slice(0, 50)))
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(KEY) ?? '[]')
}