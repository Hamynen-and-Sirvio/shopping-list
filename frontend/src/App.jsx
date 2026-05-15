import { useEffect, useState } from 'react'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
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
    if (token) {
      reloadEntries()
    }
  }, [token])

  if (token) {
    return (
      <div className="app-container">
        <Header
          entryService={entryService}
          checkedEntries={checkedEntries}
          reloadEntries={reloadEntries}
        />
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
