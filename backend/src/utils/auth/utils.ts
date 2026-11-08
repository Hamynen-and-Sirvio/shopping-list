import type { Request } from 'express'


export const getTokenFrom = (req: Request) => {
  const authorization = req.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
