import { describe, expect, it } from 'vitest'
import {
  calculateGeneratorCost,
  calculateOfflineReward,
  calculateProductionPerSecond,
} from '../../src/game/economy'
import { createInitialGameState } from '../../src/game/reducer'

describe('game economy', () => {
  it('caps offline rewards at eight hours of production', () => {
    const state = createInitialGameState({
      generatorLevels: { bamboo: 2 },
      lastSavedAt: 0,
    })

    expect(calculateOfflineReward(state, 9 * 60 * 60 * 1000)).toBe(
      calculateProductionPerSecond(state) * 8 * 60 * 60,
    )
  })

  it('increases bulk generator costs as levels grow', () => {
    expect(calculateGeneratorCost('bamboo', 1, 0)).toBe(15)
    expect(calculateGeneratorCost('bamboo', 1, 1)).toBeGreaterThan(15)
  })
})
