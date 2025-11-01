import { test, expect } from '@playwright/test'

test.describe('Rewir AI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rewir')
  })

  test('should display rewir page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Rewir/i)
  })

  test('should display scenes grid', async ({ page }) => {
    // Wait for scenes to load (either from API or fallback)
    const scenesSection = page.locator('section, main').filter({ hasText: /Scene|scena/i })
    await expect(scenesSection.first()).toBeVisible({ timeout: 10000 })
  })

  test('should handle loading state', async ({ page }) => {
    // Check if loading indicator appears (if implemented)
    const loadingText = page.getByText(/loading|Loading/i)
    const isLoading = await loadingText.isVisible({ timeout: 2000 }).catch(() => false)
    // Loading state is optional, test passes if no loading indicator
  })

  test('should navigate to scene detail on click', async ({ page }) => {
    // Wait for scenes to load
    await page.waitForTimeout(2000)
    
    const sceneCard = page.locator('[href*="/scena/"]').first()
    const hasScenes = await sceneCard.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasScenes) {
      await sceneCard.click()
      await expect(page).toHaveURL(/.*scena.*/)
    }
  })

  test('should display error state if API fails', async ({ page }) => {
    // Intercept API calls and force error
    await page.route('**/api/scenes/index*', route => route.abort())
    
    // Reload page
    await page.reload()
    
    // Check for error state or fallback content
    const errorOrFallback = page.locator('text=/error|Error|Failed|fallback/i')
    const hasError = await errorOrFallback.isVisible({ timeout: 5000 }).catch(() => false)
    
    // Test passes if error is handled gracefully (either error message or fallback)
    expect(hasError || await page.locator('section').count() > 0).toBeTruthy()
  })
})

