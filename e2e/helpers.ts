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

export async function seedListWithPrompts(
  page: Page,
  listName: string,
  texts: string[]
) {
  await page.evaluate(
    async ({ listName, texts }) => {
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open('promptbox')
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          const db = request.result
          const tx = db.transaction(
            ['prompts', 'promptLists'],
            'readwrite'
          )
          const prompts = tx.objectStore('prompts')
          const lists = tx.objectStore('promptLists')
          const itemIds: number[] = []

          const addList = () => {
            lists.add({
              name: listName,
              index: 0,
              itemIds,
            })
          }

          if (texts.length === 0) {
            addList()
          } else {
            texts.forEach((text, index) => {
              const addReq = prompts.add({ text, index })
              addReq.onsuccess = () => {
                itemIds.push(addReq.result as number)
                if (itemIds.length === texts.length) {
                  addList()
                }
              }
            })
          }

          tx.oncomplete = () => {
            db.close()
            resolve()
          }
          tx.onerror = () => reject(tx.error)
        }
      })
    },
    { listName, texts }
  )
  await page.reload()
  await page.waitForLoadState('networkidle')
}
