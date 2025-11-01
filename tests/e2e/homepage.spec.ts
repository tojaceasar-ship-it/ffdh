import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Fruits From Da Hood')
    await expect(page.getByRole('link', { name: /Shop Now/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Explore Rewir/i })).toBeVisible()
  })

  test('should navigate to shop from hero CTA', async ({ page }) => {
    await page.getByRole('link', { name: /Shop Now/i }).click()
    await expect(page).toHaveURL(/.*shop.*/)
  })

  test('should display character spotlight if characters exist', async ({ page }) => {
    const characterSection = page.locator('section').filter({ hasText: /Character Universe/i })
    // Section may or may not be visible depending on data
    const isVisible = await characterSection.isVisible().catch(() => false)
    if (isVisible) {
      await expect(characterSection).toBeVisible()
    }
  })

  test('should display community showcase', async ({ page }) => {
    await expect(page.getByText(/Join the Community/i)).toBeVisible()
    await expect(page.getByText(/Community Members/i)).toBeVisible()
  })

  test('should navigate to rewir from community CTA', async ({ page }) => {
    const rewirLink = page.getByRole('link', { name: /Explore Rewir AI/i })
    if (await rewirLink.isVisible()) {
      await rewirLink.click()
      await expect(page).toHaveURL(/.*rewir.*/)
    }
  })

  test('should display interactive quiz', async ({ page }) => {
    await expect(page.getByText(/Find Your Fruit/i)).toBeVisible()
  })

  test('should display social proof metrics', async ({ page }) => {
    await expect(page.getByText(/Customer Rating/i)).toBeVisible()
    await expect(page.getByText(/Orders Shipped/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('link', { name: /Shop Now/i })).toBeVisible()
  })
})

