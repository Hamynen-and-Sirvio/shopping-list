import { useEffect, useState } from 'react'
import Header from './layout/Header'
import Content from './layout/Content'
import Footer from './layout/Footer'
import Login from './layout/Login'
import entryService from './services/entryService'
import tokenService from './services/tokenService'
import './App.css'

const App = () => {
  const [entries, setEntries] = useState([])
  const [checkedEntries, setCheckedEntries] = useState([])
  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const reloadEntries = async () => {
    const fetchedEntries = await entryService.getEntries()
    setEntries(fetchedEntries)
    setCheckedEntries(
      fetchedEntries.filter((entry) => entry.checked).map((entry) => entry.id),
    )
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
          checkedEntries={checkedEntries}
          setCheckedEntries={setCheckedEntries}
          reloadEntries={reloadEntries}
        />
        <Content entries={entries} reloadEntries={reloadEntries} />
        <Footer reloadEntries={reloadEntries} />
      </div>
    )
  } else {
    return <Login setToken={setToken} />
  }
}

export default App
