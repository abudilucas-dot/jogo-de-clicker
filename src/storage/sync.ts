import type { GameState } from '../game/types'

export function selectMostAdvancedSave(local: GameState, remote: GameState): GameState {
  const localScore = local.totalPawsEarned + local.moonlight * 100_000 + local.unlockedHabitatIds.length * 10_000
  const remoteScore = remote.totalPawsEarned + remote.moonlight * 100_000 + remote.unlockedHabitatIds.length * 10_000
  return remoteScore > localScore ? remote : local
}
