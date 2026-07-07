import { test, expect } from '@playwright/test'
import { resetDatabase } from './helpers'

test.beforeEach(async ({ page }) => {
  await resetDatabase(page)
})

test('loads the home page', async ({ page }) => {
  await expect(
    page.getByText('Promptbox').first()
  ).toBeVisible()
  await expect(page.getByText('Search')).toBeVisible()
  await expect(
    page.getByText('Create a prompt list')
  ).toBeVisible()
})

test('opens the search modal', async ({ page }) => {
  await page.getByText('Search').click()
  await expect(
    page.getByPlaceholder('Search prompt list')
  ).toBeVisible()
})
