import { useEffect, useState } from 'react'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import Loading from './components/Loading/Loading'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [entries, setEntries] = useState([])
  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const checkedEntries = entries
    .filter((entry) => entry.checked)
    .map((entry) => entry.id)

  const reloadEntries = async () => {
    try {
      const fetchedEntries = await entryService.getEntries()
      setEntries(fetchedEntries)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!token) return
      try {
        setIsLoading(true)
        await reloadEntries()
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [token])

  if (token) {
    return (
      <div className="app-container">
        <Header
          entryService={entryService}
          checkedEntries={checkedEntries}
          reloadEntries={reloadEntries}
        />
        {isLoading && <Loading />}
        <Content
          entryService={entryService}
          entries={entries}
          reloadEntries={reloadEntries}
        />
        <Footer entryService={entryService} reloadEntries={reloadEntries} />
      </div>
    )
  } else {
    return (
      <Login
        userService={userService}
        tokenService={tokenService}
        setToken={setToken}
      />
    )
  }
}

export default App
