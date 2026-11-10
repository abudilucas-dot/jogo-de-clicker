export type HabitatId = 'bamboo' | 'neon-savanna' | 'moon-garden' | 'prism-aquarium' | 'star-jungle'

export type GeneratorId = string

export interface GeneratorDefinition {
  id: GeneratorId
  name: string
  baseCost: number
  production: number
  growth: number
}

export interface HabitatDefinition {
  id: HabitatId
  name: string
  animal: string
  unlockCost: number
}

export interface GameState {
  paws: number
  moonlight: number
  totalPawsEarned: number
  generatorLevels: Partial<Record<GeneratorId, number>>
  unlockedHabitatIds: HabitatId[]
  activeHabitatId: HabitatId
  habitatUpgradeIds: string[]
  lastSavedAt: number
}

export type GameAction =
  | { type: 'CLICK' }
  | { type: 'BUY_GENERATOR'; generatorId: GeneratorId; quantity: number }
  | { type: 'CLAIM_OFFLINE'; now: number }
  | { type: 'UNLOCK_HABITAT'; habitatId: HabitatId; cost: number }
  | { type: 'PRESTIGE' }
