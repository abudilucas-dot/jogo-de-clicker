import type { GameState } from '../game/types'

const SAVE_KEY = 'zoo-noturno-save'

export function saveLocal(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state }))
}

export function loadLocalSave(): GameState | null {
  try {
    const payload: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    if (!payload || typeof payload !== 'object' || !('state' in payload)) return null
    const state = payload.state
    if (!state || typeof state !== 'object' || !('paws' in state) || typeof state.paws !== 'number') return null
    return state as GameState
  } catch {
    return null
  }
}
