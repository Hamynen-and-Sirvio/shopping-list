export class EntryService {
  #apiUrl
  #tokenService

  constructor(apiUrl, tokenService) {
    this.#apiUrl = apiUrl
    this.#tokenService = tokenService
  }

  async getEntries() {
    const response = await fetch(this.#apiUrl, {
      headers: { 'Authorization': `Bearer ${this.#tokenService.fetchToken()}` },
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }

  async deleteEntries(entryIds) {
    const response = await fetch(`${this.#apiUrl}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#tokenService.fetchToken()}`,
      },
      body: JSON.stringify({ ids: entryIds }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
  }

  async checkEntry(entry) {
    const response = await fetch(`${this.#apiUrl}/${entry.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#tokenService.fetchToken()}`,
      },
      body: JSON.stringify({ checked: !entry.checked }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }

  async moveEntry(entry, amount) {
    const response = await fetch(`${this.#apiUrl}/${entry.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#tokenService.fetchToken()}`,
      },
      body: JSON.stringify({ position: entry.position + amount }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }

  async editEntry(entry, content) {
    const response = await fetch(`${this.#apiUrl}/${entry.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#tokenService.fetchToken()}`,
      },
      body: JSON.stringify({ content: content }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }

  async addEntry(content) {
    const response = await fetch(this.#apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#tokenService.fetchToken()}`,
      },
      body: JSON.stringify({ content: content }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }
}
