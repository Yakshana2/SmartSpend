import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should login existing user', async ({ page }) => {
    // First register
    await page.goto('/register')
    const email = `user${Date.now()}@example.com`
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'pass1234')
    await page.click('button[type="submit"]')
    
    // Logout
    await page.click('text=Logout')
    
    // Login
    await page.goto('/login')
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', 'pass1234')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })
})
