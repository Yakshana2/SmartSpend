import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Register and login before each test
  await page.goto('/register')
  const email = `expense${Date.now()}@example.com`
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', 'pass1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
})

test.describe('Expenses', () => {
  test('should add an expense', async ({ page }) => {
    await page.goto('/expenses')
    await page.click('text=+ Add Expense')
    await page.fill('input[id="title"]', 'Lunch')
    await page.fill('input[id="amount"]', '12.50')
    await page.fill('input[id="date"]', '2024-06-01')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Lunch')).toBeVisible()
    await expect(page.locator('text=$12.50')).toBeVisible()
  })

  test('should delete an expense', async ({ page }) => {
    await page.goto('/expenses')
    await page.click('text=+ Add Expense')
    await page.fill('input[id="title"]', 'ToDelete')
    await page.fill('input[id="amount"]', '5.00')
    await page.fill('input[id="date"]', '2024-06-01')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=ToDelete')).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.click('tr:has-text("ToDelete") button.danger')
    await expect(page.locator('text=ToDelete')).not.toBeVisible()
  })

  test('should show expenses on dashboard', async ({ page }) => {
    await page.goto('/expenses')
    await page.click('text=+ Add Expense')
    await page.fill('input[id="title"]', 'Dashboard Test')
    await page.fill('input[id="amount"]', '99.00')
    await page.fill('input[id="date"]', '2024-06-01')
    await page.click('button[type="submit"]')

    await page.goto('/')
    await expect(page.locator('text=$99.00')).toBeVisible()
  })
})
