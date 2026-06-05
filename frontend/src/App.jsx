import { useEffect, useState } from 'react'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [entries, setEntries] = useState([])
  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const checkedEntries = entries
    .filter((entry) => entry.checked)
    .map((entry) => entry.id)

  const addEntry = async (entry) => {
    try {
      await entryService.addEntry(entry)
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
  }

  const checkEntry = async (entry) => {
    try {
      await entryService.checkEntry(entry)
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteEntries = async () => {
    if (!confirm(`Delete ${checkedEntries.length} checked entries?`)) return
    try {
      await entryService.deleteEntries(checkedEntries)
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
  }

  const moveEntry = async (entry, amount) => {
    try {
      await entryService.moveEntry(entry, amount)
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
  }

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
        <Header deleteEntries={deleteEntries} checkedEntries={checkedEntries} />
        <Content
          entryService={entryService}
          entries={entries}
          reloadEntries={reloadEntries}
          isLoading={isLoading}
          moveEntry={moveEntry}
          checkEntry={checkEntry}
        />
        <Footer addEntry={addEntry} />
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
