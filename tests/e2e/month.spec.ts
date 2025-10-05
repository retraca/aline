import { test, expect } from '@playwright/test'

test('month export json works', async ({ page }) => {
  await page.goto('/app/month')
  await expect(page.getByRole('heading', { name: 'Month' })).toBeVisible()
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/export') && r.request().method() === 'GET'),
    page.getByRole('button', { name: /export json/i }).click(),
  ])
  expect(resp.ok()).toBeTruthy()
})


