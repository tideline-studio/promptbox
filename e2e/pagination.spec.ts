import { test, expect, Page } from '@playwright/test'
import {
  resetDatabase,
  seedListWithPrompts,
} from './helpers'

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Pagination layout is verified on the desktop workspace'
  )
  await resetDatabase(page)
})

const openList = async (page: Page) => {
  await page
    .getByText('Leetcode', { exact: true })
    .click({ force: true })
}

test('hides pagination when every prompt fits on one page', async ({
  page,
}) => {
  await seedListWithPrompts(page, 'Leetcode', [
    'first prompt',
    'second prompt',
  ])
  await openList(page)

  await expect(page.getByText('first prompt')).toBeVisible()
  await expect(
    page.getByText('second prompt')
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Pagination' })
  ).toHaveCount(0)
})

test('pins pagination to the bottom when items overflow', async ({
  page,
}) => {
  const texts = Array.from(
    { length: 30 },
    (_, index) => `Prompt item ${index + 1}`
  )
  await seedListWithPrompts(page, 'Leetcode', texts)
  await openList(page)

  const pager = page.getByRole('navigation', {
    name: 'Pagination',
  })
  await expect(pager).toBeVisible()
  await expect(pager).toContainText('/ ')
  await expect(
    page.getByText('Prompt item 1', { exact: true })
  ).toBeVisible()
  await expect(
    page.getByText('Prompt item 30', { exact: true })
  ).toHaveCount(0)

  const next = pager.getByRole('button', { name: '>' })
  await next.click()
  await expect(
    page.getByText('Prompt item 1', { exact: true })
  ).toHaveCount(0)
  await expect(
    page.getByText(/^Prompt item \d+$/).first()
  ).toBeVisible()

  const pageLabel = await pager.innerText()
  const pageMatch = pageLabel.match(/(\d+)\s*\/\s*(\d+)/)
  expect(pageMatch).toBeTruthy()
  const remaining =
    Number(pageMatch![2]) - Number(pageMatch![1])
  for (let step = 0; step < remaining; step += 1) {
    await next.click()
  }

  const lastVisible = page
    .getByText(/^Prompt item \d+$/)
    .last()
  const lastBox = await lastVisible.boundingBox()
  const pagerBox = await pager.boundingBox()
  const viewport = page.viewportSize()
  expect(lastBox).toBeTruthy()
  expect(pagerBox).toBeTruthy()
  expect(viewport).toBeTruthy()
  expect(pagerBox!.y).toBeGreaterThan(
    lastBox!.y + lastBox!.height
  )
  expect(
    viewport!.height - (pagerBox!.y + pagerBox!.height)
  ).toBeLessThan(80)
})
