import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Fruits From Da Hood/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("status");
  });

  test("product page loads (if available)", async ({ page }) => {
    // Try to load a product page
    // First, check if we can get a product slug from the shop
    await page.goto("/shop");
    
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    
    // Try to find a product link
    const productLink = page.locator('a[href*="/product/"]').first();
    
    if (await productLink.count() > 0) {
      const href = await productLink.getAttribute("href");
      if (href) {
        await page.goto(href);
        await expect(page.locator("body")).toBeVisible();
      }
    } else {
      // Skip if no products available
      test.skip();
    }
  });
});

