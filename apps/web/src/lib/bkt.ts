/**
 * Bayesian Knowledge Tracing (BKT)
 *
 * Tracks the probability that a student knows each concept.
 *
 * After each answer:
 *   P(Lₜ | correct) = P(Lₜ) * (1 - P(S)) / [ P(Lₜ) * (1 - P(S)) + (1 - P(Lₜ)) * P(G) ]
 *   P(Lₜ | wrong)   = P(Lₜ) * P(S) / [ P(Lₜ) * P(S) + (1 - P(Lₜ)) * (1 - P(G)) ]
 *   P(Lₜ₊₁) = P(Lₜ) + (1 - P(Lₜ)) * P(T)    (transition after learning opportunity)
 */

export interface BKTParams {
  pKnown: number   // P(L₀) initial probability of knowing
  pGuess: number   // P(G) guess probability
  pSlip: number    // P(S) slip probability
  pLearn: number   // P(T) transition/learn probability
}

export interface BKTResult {
  pKnown: number
  numAttempts: number
  numCorrect: number
}

export function updateBKT(
  params: BKTParams,
  isCorrect: boolean,
  numAttempts: number,
  numCorrect: number,
): BKTResult {
  const { pGuess, pSlip, pLearn } = params
  let pKnown = params.pKnown

  // Posterior given observation
  if (isCorrect) {
    const denom = pKnown * (1 - pSlip) + (1 - pKnown) * pGuess
    pKnown = denom > 0 ? (pKnown * (1 - pSlip)) / denom : pKnown
  } else {
    const denom = pKnown * pSlip + (1 - pKnown) * (1 - pGuess)
    pKnown = denom > 0 ? (pKnown * pSlip) / denom : pKnown
  }

  // Transition: student may learn after this opportunity
  pKnown = pKnown + (1 - pKnown) * pLearn

  return {
    pKnown: Math.round(pKnown * 10000) / 10000,
    numAttempts: numAttempts + 1,
    numCorrect: numCorrect + (isCorrect ? 1 : 0),
  }
}

export function isMastered(pKnown: number, threshold = 0.85): boolean {
  return pKnown >= threshold
}
