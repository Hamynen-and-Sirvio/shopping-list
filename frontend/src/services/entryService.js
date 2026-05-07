import tokenService from './tokenService'

const getEntries = async () => {
  const response = await fetch('/api/entries', {
    headers: { 'Authorization': `Bearer ${tokenService.fetchToken()}` },
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

const deleteEntry = async (entryId) => {
  const response = await fetch(`/api/entries/${entryId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${tokenService.fetchToken()}` },
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

const checkEntry = async (entry) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ checked: !entry.checked }),
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

const moveEntry = async (entry, amount) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ position: entry.position + amount }),
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

const editEntry = async (entry, content) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ content: content }),
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

const addEntry = async (content) => {
  const response = await fetch('/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ content: content }),
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

export default {
  getEntries,
  deleteEntry,
  checkEntry,
  moveEntry,
  editEntry,
  addEntry,
}
