/**
 * SM-2 Spaced Repetition Algorithm
 *
 * After each review:
 *   quality: 0-5 rating (0=forgot, 3=recalled with difficulty, 5=perfect)
 *
 *   if quality >= 3:
 *     if first review: interval = 1 day
 *     elif second review: interval = 6 days
 *     else: interval = Math.round(interval * easeFactor)
 *     easeFactor += 0.1
 *   else:
 *     interval = 1 day
 *     easeFactor -= 0.2
 *
 *   easeFactor = Math.max(1.3, easeFactor)
 *   nextReview = now + interval days
 */

export interface SM2Item {
  easeFactor: number
  interval: number
  repetitions: number
  nextReview: Date
}

export function updateSM2(
  prev: { easeFactor: number; interval: number; repetitions: number },
  quality: number,
): { easeFactor: number; interval: number; repetitions: number; nextReview: Date } {
  let { easeFactor, interval, repetitions } = prev

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)

    repetitions += 1
    easeFactor += 0.1
  } else {
    repetitions = 0
    interval = 1
    easeFactor -= 0.2
  }

  easeFactor = Math.max(1.3, easeFactor)
  interval = Math.max(1, interval)

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return { easeFactor: Math.round(easeFactor * 100) / 100, interval, repetitions, nextReview }
}
