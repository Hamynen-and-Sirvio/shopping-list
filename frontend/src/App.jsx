import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const {
    data: entries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['entries'],
    queryFn: () => entryService.getEntries(),
    enabled: !!token,
  })

  const checkedEntries = entries
    .filter((entry) => entry.checked)
    .map((entry) => entry.id)

  if (!token) {
    return (
      <Login
        userService={userService}
        tokenService={tokenService}
        setToken={setToken}
      />
    )
  }

  if (error) {
    return <div>Error loading entries</div>
  }

  return (
    <div className="app-container">
      <Header entryService={entryService} checkedEntries={checkedEntries} />
      <Content
        entryService={entryService}
        entries={entries}
        isLoading={isLoading}
      />
      <Footer entryService={entryService} />
    </div>
  )
}

export default App
