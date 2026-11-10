import type { GeneratorDefinition, HabitatDefinition } from '../game/types'

export const HABITATS: HabitatDefinition[] = [
  { id: 'bamboo', name: 'Bosque de Bambu', animal: 'Panda', unlockCost: 0 },
  { id: 'neon-savanna', name: 'Savana de Neon', animal: 'Zebra', unlockCost: 25_000 },
  { id: 'moon-garden', name: 'Jardim da Lua', animal: 'Raposa', unlockCost: 250_000 },
  { id: 'prism-aquarium', name: 'Aquário Prismático', animal: 'Axolote', unlockCost: 2_500_000 },
  { id: 'star-jungle', name: 'Selva de Estrelas', animal: 'Tigre', unlockCost: 25_000_000 },
]

export const GENERATORS: GeneratorDefinition[] = [
  { id: 'bamboo', name: 'Bambu Bioluminescente', baseCost: 15, production: 1, growth: 1.15 },
  { id: 'lantern', name: 'Lanternas de Luar', baseCost: 100, production: 8, growth: 1.17 },
  { id: 'drone', name: 'Drone Alimentador', baseCost: 900, production: 48, growth: 1.18 },
  { id: 'observatory', name: 'Observatório Lunar', baseCost: 10_000, production: 300, growth: 1.2 },
]

export const INITIAL_CATALOG = { habitats: HABITATS, generators: GENERATORS }
