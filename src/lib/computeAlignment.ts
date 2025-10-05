export type Config = {
  habits: string[]
  metrics: { name: string; type: 'number' | 'scale10'; goal?: number }[]
}

export function computeAlignment(
  checks: Record<string, boolean>,
  values: Record<string, number>,
  cfg: Config,
): number {
  let earned = 0
  let possible = 0

  cfg.habits.forEach((h) => {
    possible += 1
    if (checks?.[h]) earned += 1
  })

  const sleep = values?.['Sleep'] ?? 0
  possible += 1
  if (sleep >= (cfg.metrics.find((m) => m.name === 'Sleep')?.goal ?? 7.5)) earned += 1

  ;['Energy', 'Emotion'].forEach((m) => {
    possible += 1
    if ((values?.[m] ?? 0) >= 7) earned += 1
  })

  return Math.round((earned / possible) * 100)
}


