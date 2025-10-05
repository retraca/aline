import { computeAlignment, type Config } from './computeAlignment'

const cfg: Config = {
  habits: ['Deep Work', 'Workout', 'THC-Free', 'Nutrition', 'Journal', 'Love'],
  metrics: [
    { name: 'Sleep', type: 'number', goal: 7.5 },
    { name: 'Energy', type: 'scale10' },
    { name: 'Emotion', type: 'scale10' },
  ],
}

describe('computeAlignment', () => {
  it('reaches 100 when all satisfied', () => {
    const checks = Object.fromEntries(cfg.habits.map((h) => [h, true]))
    const values = { Sleep: 8, Energy: 9, Emotion: 9 }
    const res = computeAlignment(checks, values, cfg)
    expect(res).toBe(100)
  })

  it('is 0 when none satisfied', () => {
    const checks = Object.fromEntries(cfg.habits.map((h) => [h, false]))
    const values = { Sleep: 0, Energy: 0, Emotion: 0 }
    const res = computeAlignment(checks, values, cfg)
    expect(res).toBe(0)
  })
})


