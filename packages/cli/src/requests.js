import fetch from 'node-fetch'

const BASE_URL =
  'https://api.github.com/repos/ivanatias/ezreact/contents/packages/main/src/lib'

export async function getUtility({ name, type = 'hooks' } = {}) {
  const ext = name.split('.').pop()
  const endpoint = `${BASE_URL}/${ext}/${type}/${name}${type === 'components' ? 'x' : ''}`
  const response = await fetch(endpoint)

  if (!response.ok) {
    if (response.status === 404) throw new Error(`Utility ${name}.${ext} not found!`)
    throw new Error('Something went wrong retrieving the utility. Try again!')
  }

  const { content: base64Content } = await response.json()
  const buffer = Buffer.from(base64Content, 'base64')
  const content = buffer.toString('utf-8')

  return { name, content }
}

export async function getAllUtilities({ ext = 'ts', type = 'hooks' } = {}) {
  const endpoint = `${BASE_URL}/${ext}/${type}`
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error('Something went wrong retrieving the utilities. Try again!')
  }

  const utilities = await response.json()

  return Promise.all(
    utilities.map((u) => {
      return getUtility({ name: u.name, type })
    })
  )
}
