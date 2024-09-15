import { writeFile } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

export async function writeUtility({ name, content, writePath = '' } = {}) {
  if (!content || !name) {
    throw new TypeError('Utility name and content must be passed')
  }

  const filePath = path.join(process.cwd(), writePath, name)

  await writeFile(filePath, content).catch((err) => {
    throw new Error(
      `Failed to write ${name} utility to ${filePath}. [Reason]: ${err.message}`
    )
  })
}

export function createDirectoryIfNeeded(chosenPath) {
  if (!chosenPath) throw new TypeError('Path for new directory must be passed')

  const dirPath = path.join(process.cwd(), chosenPath)

  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
}
