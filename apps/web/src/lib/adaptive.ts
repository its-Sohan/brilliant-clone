/**
 * Adaptive difficulty using a simple ELO-like system.
 *
 * After each block attempt:
 *   If correct: skill += 0.1 * (1 - skill/maxSkill)
 *   If wrong:   skill -= 0.1 * (skill/maxSkill)
 *
 * Next block recommendation:
 *   |block.difficulty - user.skill| <= 1  (zone of proximal development)
 */

export const MAX_SKILL = 10
export const MIN_SKILL = 1
export const ADJUST_RATE = 0.1

export function updateSkill(skillLevel: number, blockDifficulty: number, isCorrect: boolean): number {
  const diff = blockDifficulty - skillLevel
  const adjustment = ADJUST_RATE * (isCorrect ? 1 : -1) * (1 + diff * 0.05)

  let newSkill = skillLevel + adjustment
  newSkill = Math.max(MIN_SKILL, Math.min(MAX_SKILL, newSkill))
  return Math.round(newSkill * 100) / 100
}

export function isInZone(blockDifficulty: number, skillLevel: number): boolean {
  return Math.abs(blockDifficulty - skillLevel) <= 1
}
