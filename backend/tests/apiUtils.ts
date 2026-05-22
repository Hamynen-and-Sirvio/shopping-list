import { EntryUpdate } from '../src/types.ts'


export const login = async (apiUrl: string, password: string) => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password }),
  })

  const responseBody = await response.json()

  return responseBody
}

export const fetchEntries = async (apiUrl: string, token: string) => {
  const response = await fetch(`${apiUrl}/entries`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const entries = await response.json()
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
  const createdEntry = await response.json()
  return createdEntry
}

export const deleteEntry = async (apiUrl: string, token: string, id: number) => {
  const response = await fetch(`${apiUrl}/entries/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  })
  const deletedEntry = await response.json()
  return deletedEntry
}

export const editEntry = async (
  apiUrl: string,
  token: string,
  id: number,
  editedFields: EntryUpdate,
) => {
  const response = await fetch(`${apiUrl}/entries/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedFields),
  })
  const editedEntry = await response.json()
  return editedEntry
}
