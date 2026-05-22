import { beforeAll, describe, expect, test } from 'vitest'
import { Entry } from '../generated/prisma/client.ts'

import {
  createEntry,
  deleteEntry,
  editEntry,
  fetchEntries,
  login,
} from './apiUtils.ts'

const API_URL = 'http://localhost:3000'
const PASSWORD = 'password'

beforeAll(async () => {
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(API_URL)
      break
    } catch {
      await new Promise(r => setTimeout(r, 100))
    }
  }
})

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

    expect(createdEntry.position).toSatisfy(Number.isInteger)
    expect(createdEntry.position).toBeGreaterThan(0)
  })

  test('can be fetched', async () => {
    const entry = { content: 'Something' }

    const createdEntry = await createEntry(API_URL, token, entry)
    const fetchedEntries = await fetchEntries(API_URL, token)
    const originalEntry = fetchedEntries.find((entry: Entry) =>
      entry.id === createdEntry.id
    )

    expect(originalEntry.position).toBe(fetchedEntries.length)
    expect(originalEntry).toStrictEqual(createdEntry)
  })

  test('can be deleted', async () => {
    const entry = { content: 'Something' }

    const createdEntry = await createEntry(API_URL, token, entry)
    const deletedEntry = await deleteEntry(API_URL, token, createdEntry.id)

    expect(deletedEntry).toStrictEqual(createdEntry)

    const fetchedEntries = await fetchEntries(API_URL, token)

    expect(fetchedEntries).not.toContainEqual(deletedEntry)
  })

  test('can be edited', async () => {
    const entry = { content: 'Something' }
    const editedFields = {
      content: 'Something else',
      checked: true,
      position: 1,
    }

    const createdEntry = await createEntry(API_URL, token, entry)
    const id = createdEntry.id

    const editedEntry = await editEntry(API_URL, token, id, editedFields)

    expect(editedEntry).toStrictEqual({ ...createdEntry, ...editedFields })

    const fetchedEntries = await fetchEntries(API_URL, token)
    const fetchedEntry = fetchedEntries.find((entry: Entry) => entry.id === id)

    expect(fetchedEntry).toStrictEqual({ ...createdEntry, ...editedFields })
  })
})
