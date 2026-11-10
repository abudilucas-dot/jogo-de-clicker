import { afterEach, expect, it } from 'vitest'
import { loadLocalSave, saveLocal } from '../../src/storage/local-save'
import { createInitialGameState } from '../../src/game/reducer'

afterEach(() => localStorage.clear())

it('returns null for a corrupted visitor save', () => {
  localStorage.setItem('zoo-noturno-save', '{oops')
  expect(loadLocalSave()).toBeNull()
})

it('restores a saved visitor game', () => {
  const state = createInitialGameState({ paws: 42 })
  saveLocal(state)
  expect(loadLocalSave()?.paws).toBe(42)
})
