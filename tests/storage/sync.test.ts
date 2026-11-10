import { expect, it } from 'vitest'
import { createInitialGameState } from '../../src/game/reducer'
import { selectMostAdvancedSave } from '../../src/storage/sync'

it('keeps the save with greater valid lifetime progress', () => {
  const local = createInitialGameState({ totalPawsEarned: 1_000 })
  const remote = createInitialGameState({ totalPawsEarned: 2_000 })
  expect(selectMostAdvancedSave(local, remote)).toBe(remote)
})
