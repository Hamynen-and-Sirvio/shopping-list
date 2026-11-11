import * as config from './config.ts'
import { createApp } from './app.ts'


process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const app = await createApp(config)

app.listen(config.port, config.host, () => {
  console.log(`Server running on 'http://${config.host}:${String(config.port)}'`)
})
