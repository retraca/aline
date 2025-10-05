import { test, expect } from '@playwright/test'

test('week page loads and shows inputs', async ({ page }) => {
  await page.goto('/app/week')
  await expect(page.getByRole('heading', { name: 'Week' })).toBeVisible()
  await expect(page.locator('input[type="number"]')).toHaveCount(2)
})


