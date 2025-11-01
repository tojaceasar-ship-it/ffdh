import { test, expect } from '@playwright/test'

test.describe('Shop Flow E2E Tests', () => {
  test('should complete full shopping flow from landing to success', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/')
    await expect(page).toHaveTitle(/Fruits From Da Hood/)

    // 2. Navigate to shop
    await page.getByRole('link', { name: /shop|sklep/i }).click()
    await expect(page).toHaveURL(/\/sklep/)
    await expect(page.getByText('Shop FFDH')).toBeVisible()

    // 3. Click on first product
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await expect(firstProduct).toBeVisible()
    await firstProduct.click()

    // 4. Verify product page loads
    await expect(page.getByRole('heading')).toBeVisible()

    // 5. Add to cart
    await page.getByRole('button', { name: /add to cart|dodaj do koszyka/i }).click()

    // 6. Verify cart has item
    const cartCount = page.locator('[data-testid="cart-count"]')
    await expect(cartCount).toHaveText('1')

    // 7. Go to checkout
    await page.getByRole('link', { name: /checkout|koszyk/i }).click()
    await expect(page).toHaveURL(/\/sklep\/koszyk/)

    // 8. Fill checkout form (mock data)
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.fill('[data-testid="name"]', 'Test User')
    await page.fill('[data-testid="address"]', 'Test Address 123')

    // 9. Submit checkout (this would trigger Stripe in real scenario)
    await page.getByRole('button', { name: /checkout|zapłać/i }).click()

    // 10. Verify redirect to success page
    await expect(page).toHaveURL(/\/success/)
    await expect(page.getByText(/success|pomyślnie/i)).toBeVisible()
  })

  test('should handle cart operations correctly', async ({ page }) => {
    await page.goto('/sklep')

    // Add first product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Check cart count
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

    // Go to cart
    await page.getByRole('link', { name: /cart|koszyk/i }).click()

    // Verify cart contents
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)

    // Update quantity
    await page.locator('[data-testid="quantity-increase"]').click()
    await expect(page.locator('[data-testid="quantity"]')).toHaveValue('2')

    // Remove item
    await page.locator('[data-testid="remove-item"]').click()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(0)
    await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible()
  })

  test('should validate checkout form', async ({ page }) => {
    await page.goto('/sklep')

    // Add product and go to checkout
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.getByRole('link', { name: /checkout/i }).click()

    // Try to submit empty form
    await page.getByRole('button', { name: /checkout/i }).click()

    // Verify validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/name is required/i)).toBeVisible()

    // Fill invalid email
    await page.fill('[data-testid="email"]', 'invalid-email')
    await page.getByRole('button', { name: /checkout/i }).click()

    // Verify email validation
    await expect(page.getByText(/valid email/i)).toBeVisible()
  })

  test('should handle out of stock products', async ({ page }) => {
    await page.goto('/sklep')

    // Find sold out product
    const soldOutProduct = page.locator('[data-testid="product-card"][data-sold-out="true"]').first()

    if (await soldOutProduct.isVisible()) {
      // Verify add to cart is disabled
      const addToCartBtn = soldOutProduct.locator('[data-testid="add-to-cart"]')
      await expect(addToCartBtn).toBeDisabled()

      // Verify sold out indicator
      await expect(soldOutProduct.getByText(/sold out|wyprzedane/i)).toBeVisible()
    }
  })

  test('should persist cart across page reloads', async ({ page }) => {
    await page.goto('/sklep')

    // Add product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Verify cart has item
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')

    // Reload page
    await page.reload()

    // Verify cart still has item
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')
  })
})

test.describe('Accessibility Tests', () => {
  test('should have proper focus management', async ({ page }) => {
    await page.goto('/sklep')

    // Tab through navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()

    // Tab to first product
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('data-testid', 'product-card')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/sklep')

    // Navigate with keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter') // Should activate link/button

    // Should navigate somewhere (either product page or cart)
    await expect(page.url()).not.toBe('http://localhost:3000/sklep')
  })
})
