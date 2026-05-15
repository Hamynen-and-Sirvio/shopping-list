import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { EntryService } from './services/entryService.js'
import { TokenService } from './services/tokenService.js'
import { UserService } from './services/userService.js'
import { apiUrl } from './config.js'

const tokenService = new TokenService()
const userService = new UserService(`${apiUrl}/login`)
const entryService = new EntryService(`${apiUrl}/entries`, tokenService)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App
      entryService={entryService}
      tokenService={tokenService}
      userService={userService}
    />
  </StrictMode>,
)
