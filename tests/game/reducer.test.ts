import { describe, expect, it } from 'vitest'
import { createInitialGameState, reduceGame } from '../../src/game/reducer'

describe('game reducer', () => {
  it('keeps habitats and habitat upgrades after prestige', () => {
    const state = createInitialGameState({
      paws: 2_000_000,
      unlockedHabitatIds: ['bamboo', 'neon-savanna'],
      habitatUpgradeIds: ['bamboo-lantern'],
      generatorLevels: { bamboo: 8 },
    })

    const result = reduceGame(state, { type: 'PRESTIGE' })

    expect(result.paws).toBe(0)
    expect(result.generatorLevels).toEqual({})
    expect(result.unlockedHabitatIds).toEqual(['bamboo', 'neon-savanna'])
    expect(result.habitatUpgradeIds).toEqual(['bamboo-lantern'])
    expect(result.moonlight).toBeGreaterThan(0)
  })

  it('unlocks a habitat when the player can afford it', () => {
    const state = createInitialGameState({ paws: 30_000 })
    const result = reduceGame(state, { type: 'UNLOCK_HABITAT', habitatId: 'neon-savanna', cost: 25_000 })
    expect(result.unlockedHabitatIds).toContain('neon-savanna')
    expect(result.paws).toBe(5_000)
    expect(result.activeHabitatId).toBe('neon-savanna')
  })
})
