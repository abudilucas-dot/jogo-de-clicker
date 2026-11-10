import { expect, it } from 'vitest'
import { formatNumber } from '../../src/game/format'

it('abbreviates large game numbers', () => {
  expect(formatNumber(900)).toBe('900')
  expect(formatNumber(900_000)).toBe('900K')
  expect(formatNumber(1_000_000)).toBe('1M')
  expect(formatNumber(900_000_000)).toBe('900M')
  expect(formatNumber(900_000_000_000)).toBe('900B')
})
