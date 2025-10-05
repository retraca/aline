import { test, expect } from '@playwright/test'

test('fill today & save', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('**/app/today')

  // Toggle first habit (if rendered)
  const checkboxes = page.locator('input[type="checkbox"]')
  if (await checkboxes.count()) {
    await checkboxes.first().check()
  }

  // Adjust sliders
  const sliders = page.locator('input[type="range"]')
  const sliderCount = await sliders.count()
  for (let i = 0; i < sliderCount; i++) {
    await sliders.nth(i).fill('8')
  }

  await page.getByRole('button', { name: /save/i }).click()
  await expect(page.getByRole('button', { name: /save/i })).toBeVisible()
})


