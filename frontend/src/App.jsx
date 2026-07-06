import { useEffect, useState } from 'react'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(tokenService.fetchToken() || '')
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('entries')
    return saved ? JSON.parse(saved) : []
  })

  const checkedEntries = entries
    .filter((entry) => entry.checked)
    .map((entry) => entry.id)

  const addEntry = async (entry) => {
    try {
      const addedEntry = await entryService.addEntry(entry)
      setEntries((prevEntries) => [...prevEntries, addedEntry])
    } catch (error) {
      console.error(error)
    }
  }

  const checkEntry = (entry) => {
    try {
      entryService.checkEntry(entry)
      setEntries((prevEntries) =>
        prevEntries.map((prevEntry) => {
          if (prevEntry.id === entry.id) {
            return { ...prevEntry, checked: !prevEntry.checked }
          }
          return prevEntry
        }),
      )
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

  const editEntry = async (entry, content) => {
    try {
      const editedEntry = await entryService.editEntry(entry, content)
      setEntries((prevEntries) =>
        prevEntries.map((prevEntry) => {
          if (prevEntry.id === entry.id) {
            return { ...prevEntry, content: editedEntry.content }
          }
          return prevEntry
        }),
      )
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
      localStorage.setItem('entries', JSON.stringify(fetchedEntries))
    } catch (error) {
      console.error(error)
    }
  }

  const logout = () => {
    if (!confirm(`Do you want to log out?`)) return
    tokenService.removeToken()
    setToken('')
  }

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries))
  }, [entries])

  useEffect(() => {
    const load = async () => {
      if (!token) return
      try {
        setIsLoading(true)
        const fetchedEntries = await entryService.getEntries()
        setEntries(fetchedEntries)
        localStorage.setItem('entries', JSON.stringify(fetchedEntries))
      } catch (error) {
        console.error(error)
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
          deleteEntries={deleteEntries}
          checkedEntries={checkedEntries}
          logout={logout}
        />
        <Content
          entries={entries}
          isLoading={isLoading}
          editEntry={editEntry}
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
