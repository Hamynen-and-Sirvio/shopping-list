import { describe, expect, test } from 'vitest'

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

describe('Login', () => {
  test('can log in', async () => {
    const loginResponse = await login(API_URL, PASSWORD)
    expect(Object.keys(loginResponse)).toStrictEqual(['token'])
    expect(loginResponse.token).toBeTypeOf('string')
  })
})
