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
})
