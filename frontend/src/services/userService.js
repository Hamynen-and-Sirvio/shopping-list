export class UserService {
  #loginUrl

  constructor(loginUrl) {
    this.#loginUrl = loginUrl
  }

  async login(password) {
    const response = await fetch(this.#loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password }),
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    return await response.json()
  }
}
