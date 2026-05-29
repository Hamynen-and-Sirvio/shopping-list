import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { ServiceProvider } from './contexts/ServiceContext.jsx'
import { EntryService } from './services/entryService.js'
import { TokenService } from './services/tokenService.js'
import { UserService } from './services/userService.js'
import { apiUrl } from './config.js'

const tokenService = new TokenService()
const userService = new UserService(`${apiUrl}/login`)
const entryService = new EntryService(`${apiUrl}/entries`, tokenService)

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ServiceProvider
        services={{
          entryService,
          tokenService,
          userService,
        }}
      >
        <App />
      </ServiceProvider>
    </QueryClientProvider>
  </StrictMode>,
)
