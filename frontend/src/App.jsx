import { useState } from 'react'
import { useEntries } from './hooks/useEntries'
import { useServices } from './contexts/ServiceContext.jsx'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = () => {
  const { tokenService } = useServices()

  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const { error } = useEntries(token)

  if (!token) {
    return <Login setToken={setToken} />
  }

  if (error) {
    return <div>Error loading entries</div>
  }

  return (
    <div className="app-container">
      <Header />
      <Content />
      <Footer />
    </div>
  )
}

export default App
