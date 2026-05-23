import { EntryUpdate } from '../src/types.ts'
import { Entries, Entry, LoginToken } from '../src/validation.ts'


export const login = async (apiUrl: string, password: string) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password }),
  })

  const responseBody = LoginToken.parse(await response.json())

  return responseBody
}

export const fetchEntries = async (apiUrl: string, token: string) => {
  const response = await fetch(`${apiUrl}/entries`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const entries = Entries.parse(await response.json())
  return entries
}

export const createEntry = async (apiUrl: string, token: string, newEntryData: { content: string }) => {
  const response = await fetch(`${apiUrl}/entries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEntryData),
  })
  const createdEntry = Entry.parse(await response.json())
  return createdEntry
}

export const deleteEntry = async (apiUrl: string, token: string, id: number) => {
  const response = await fetch(`${apiUrl}/entries/${String(id)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const deletedEntry = Entry.parse(await response.json())
  return deletedEntry
}

export const deleteManyEntries = async (apiUrl: string, token: string, ids: number[]) => {
  await fetch(`${apiUrl}/entries`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })
}

export const editEntry = async (
  apiUrl: string,
  token: string,
  id: number,
  editedFields: EntryUpdate,
) => {
  const response = await fetch(`${apiUrl}/entries/${String(id)}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedFields),
  })
  const editedEntry = Entry.parse(await response.json())
  return editedEntry
}
