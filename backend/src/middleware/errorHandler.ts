import type { ErrorRequestHandler } from 'express'


const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }
  if (err instanceof Error) {
    console.error(err.stack)
  }
  res.status(500).json({ error: 'Internal server error' })
}


export default errorHandler
