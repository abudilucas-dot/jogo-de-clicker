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
  { id: 'vet-team', name: 'Equipe Veterinária', baseCost: 80_000, production: 1_500, growth: 1.21 },
  { id: 'moon-train', name: 'Trem Noturno', baseCost: 500_000, production: 8_000, growth: 1.22 },
  { id: 'holo-fountain', name: 'Fonte Holográfica', baseCost: 3_000_000, production: 42_000, growth: 1.23 },
  { id: 'safari-pod', name: 'Cápsula de Safári', baseCost: 18_000_000, production: 220_000, growth: 1.24 },
  { id: 'star-restaurant', name: 'Restaurante das Estrelas', baseCost: 100_000_000, production: 1_200_000, growth: 1.25 },
  { id: 'aquarium-ai', name: 'IA do Aquário Prismático', baseCost: 700_000_000, production: 6_500_000, growth: 1.26 },
  { id: 'jungle-portal', name: 'Portal da Selva', baseCost: 4_000_000_000, production: 35_000_000, growth: 1.27 },
  { id: 'aurora-dome', name: 'Cúpula Aurora', baseCost: 25_000_000_000, production: 190_000_000, growth: 1.28 },
  { id: 'lunar-sanctuary', name: 'Santuário Lunar', baseCost: 160_000_000_000, production: 1_000_000_000, growth: 1.29 },
]

export const INITIAL_CATALOG = { habitats: HABITATS, generators: GENERATORS }
