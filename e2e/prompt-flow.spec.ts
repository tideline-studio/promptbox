import { test, expect } from '@playwright/test'
import { resetDatabase } from './helpers'

test.beforeEach(async ({ page }) => {
  await resetDatabase(page)
})

test('create a list, add a prompt, and copy it', async ({
  page,
  context,
}) => {
  await context.grantPermissions([
    'clipboard-read',
    'clipboard-write',
  ])

  await page.getByText('Create a prompt list').click()

  const listNameInput = page.getByRole('textbox')
  await expect(listNameInput).toBeFocused()
  await listNameInput.fill('git')
  await expect(listNameInput).toHaveValue('git')
  await listNameInput.blur()

  await expect(
    page.getByText('git', { exact: true })
  ).toBeVisible({
    timeout: 10_000,
  })
  await page.getByText('git', { exact: true }).click()
  await page.getByText('Add a new prompt').click()

  const promptText = 'git status'
  await page.locator('textarea').fill(promptText)
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText(promptText)).toBeVisible()

  await page.getByText(promptText).hover()
  await expect(
    page.getByText('Click to copy')
  ).toBeVisible()
})
