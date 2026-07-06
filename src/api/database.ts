import { Dexie, Table } from 'dexie'

export interface IPrompt extends Omit<Prompt, 'id'> {
  id?: number
}

export interface IPromptList
  extends Omit<PromptList, 'id'> {
  id?: number
}

class PromptBoxDB extends Dexie {
  prompts!: Table<IPrompt>
  promptLists!: Table<IPromptList>

  constructor() {
    super('promptbox')
    console.info('Initializing `prompts` table...')
    this.version(1).stores({
      prompts: '++id, index, text',
    })
    this.version(1).stores({
      promptLists: '++id, index, name, itemIds',
    })
  }
  static instance(): PromptBoxDB {
    return new PromptBoxDB()
  }
}

const database = new PromptBoxDB()
export default database
