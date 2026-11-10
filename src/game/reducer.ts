import { calculateClickReward, calculateGeneratorCost, calculateOfflineReward, calculatePrestigeReward } from './economy'
import type { GameAction, GameState } from './types'

export function createInitialGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    paws: 0,
    moonlight: 0,
    totalPawsEarned: 0,
    generatorLevels: {},
    unlockedHabitatIds: ['bamboo'],
    activeHabitatId: 'bamboo',
    habitatUpgradeIds: [],
    lastSavedAt: Date.now(),
    ...overrides,
  }
}

export function reduceGame(state: GameState, action: GameAction): GameState {
  if (action.type === 'CLICK') {
    const reward = calculateClickReward(state)
    return { ...state, paws: state.paws + reward, totalPawsEarned: state.totalPawsEarned + reward }
  }

  if (action.type === 'CLAIM_OFFLINE') {
    const reward = calculateOfflineReward(state, action.now)
    return { ...state, paws: state.paws + reward, totalPawsEarned: state.totalPawsEarned + reward, lastSavedAt: action.now }
  }

  if (action.type === 'BUY_GENERATOR') {
    const currentLevel = state.generatorLevels[action.generatorId] ?? 0
    const cost = calculateGeneratorCost(action.generatorId, action.quantity, currentLevel)
    if (action.quantity < 1 || cost > state.paws) return state
    return {
      ...state,
      paws: state.paws - cost,
      generatorLevels: { ...state.generatorLevels, [action.generatorId]: currentLevel + action.quantity },
    }
  }

  if (action.type === 'UNLOCK_HABITAT') {
    if (state.paws < action.cost || state.unlockedHabitatIds.includes(action.habitatId)) return state
    return { ...state, paws: state.paws - action.cost, unlockedHabitatIds: [...state.unlockedHabitatIds, action.habitatId], activeHabitatId: action.habitatId }
  }

  if (action.type === 'PRESTIGE') {
    const reward = calculatePrestigeReward(state)
    if (reward < 1) return state
    return {
      ...state,
      paws: 0,
      moonlight: state.moonlight + reward,
      generatorLevels: {},
      totalPawsEarned: 0,
      lastSavedAt: Date.now(),
    }
  }

  return state
}
