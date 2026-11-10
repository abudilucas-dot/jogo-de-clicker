import { GENERATORS } from '../content/zoo'
import type { GameState, GeneratorId } from './types'

export const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000

const getGenerator = (generatorId: GeneratorId) => {
  const generator = GENERATORS.find((item) => item.id === generatorId)
  if (!generator) throw new Error(`Gerador desconhecido: ${generatorId}`)
  return generator
}

export function calculateGeneratorCost(generatorId: GeneratorId, quantity: number, currentLevel: number): number {
  const generator = getGenerator(generatorId)
  const safeQuantity = Math.max(0, Math.floor(quantity))
  return Math.ceil(
    Array.from({ length: safeQuantity }, (_, index) => generator.baseCost * generator.growth ** (currentLevel + index))
      .reduce((total, cost) => total + cost, 0),
  )
}

export function calculateProductionPerSecond(state: GameState): number {
  return GENERATORS.reduce(
    (total, generator) => total + (state.generatorLevels[generator.id] ?? 0) * generator.production,
    0,
  )
}

export function calculateOfflineReward(state: GameState, now: number): number {
  const elapsed = Math.max(0, Math.min(now - state.lastSavedAt, OFFLINE_CAP_MS))
  return Math.floor(calculateProductionPerSecond(state) * (elapsed / 1000))
}

export function calculateClickReward(state: GameState): number {
  return 1 + Math.floor(state.moonlight * 0.05)
}

export function calculatePrestigeReward(state: GameState): number {
  return Math.floor(Math.sqrt(Math.max(0, state.totalPawsEarned, state.paws) / 100_000))
}
