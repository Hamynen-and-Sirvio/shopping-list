import tokenService from "./tokenService"

const getEntries = async () => {
  const response = await fetch("/api/entries", {
    headers: { "Authorization": `Bearer ${tokenService.fetchToken()}` },
  })
  return response
}

const deleteEntry = async (entryId) => {
  const response = await fetch(`/api/entries/${entryId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${tokenService.fetchToken()}` },
  })
  return response
}

const checkEntry = async (entry) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ checked: !entry.checked }),
  })
  return response
}

const moveEntry = async (entry, amount) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ position: entry.position + amount }),
  })
  return response
}

const editEntry = async (entry, content) => {
  const response = await fetch(`/api/entries/${entry.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ content: content }),
  })
  return response
}

const addEntry = async (content) => {
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenService.fetchToken()}`,
    },
    body: JSON.stringify({ content: content }),
  })
  return response
}

export default {
  getEntries,
  deleteEntry,
  checkEntry,
  moveEntry,
  editEntry,
  addEntry,
}
