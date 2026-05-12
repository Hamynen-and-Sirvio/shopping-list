import { beforeAll, describe, expect, test } from 'vitest'

const API_URL = 'http://localhost:3000'
const PASSWORD = 'password'

const login = async (apiUrl: string, password: string) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password }),
  })

  const responseBody = await response.json()

  return responseBody
}

const createEntry = async (apiUrl: string, token: string, newEntryData: { content: string }) => {
  const response = await fetch(`${apiUrl}/entries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEntryData),
  })
  const createdEntry = await response.json()
  return createdEntry
}

describe('Login', () => {
  test('can log in', async () => {
    const loginResponse = await login(API_URL, PASSWORD)
    expect(Object.keys(loginResponse)).toStrictEqual(['token'])
    expect(loginResponse.token).toBeTypeOf('string')
  })
})

describe('Entries', () => {
  let token: string
  beforeAll(async () => {
    const loginResponse = await login(API_URL, PASSWORD)
    token = loginResponse.token
  })

  test('can be created', async () => {
    const entry = { content: 'Something' }

    const createdEntry = await createEntry(API_URL, token, entry)

    expect(Object.keys(createdEntry)).toStrictEqual(
      ['id', 'position', 'content', 'checked'],
    )

    expect(createdEntry.content).toBe(entry.content)
    expect(createdEntry.checked).toBe(false)
    expect(createdEntry.position).toBeTypeOf('number')
    expect(createdEntry.position).toSatisfy(Number.isInteger)
    expect(createdEntry.position).toBeGreaterThan(0)
  })
})
