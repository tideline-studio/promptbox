import { Page } from '@playwright/test'

export async function resetDatabase(page: Page) {
  await page.goto('/')
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('promptbox')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
      request.onblocked = () => resolve()
    })
  })
  await page.reload()
  await page.waitForLoadState('networkidle')
}
