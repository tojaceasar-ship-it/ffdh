import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.skip('should navigate to checkout', async ({ page }) => {
    // Skip until shop page is implemented
    await page.goto('/shop')
    // Add checkout navigation test when shop is ready
  })

  test('checkout API should validate requests', async ({ request }) => {
    // Test checkout API validation
    const response = await request.post('http://localhost:3000/api/checkout', {
      data: {
        // Invalid data to test validation
        items: []
      }
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('checkout API should require items', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/checkout', {
      data: {}
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
    const data = await response.json()
    expect(data).toHaveProperty('errors')
  })
})

