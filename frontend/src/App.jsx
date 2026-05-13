import { useEffect, useState } from 'react'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import entryService from './services/entryService'
import tokenService from './services/tokenService'
import './App.css'

const App = () => {
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
        <Header checkedEntries={checkedEntries} reloadEntries={reloadEntries} />
        <Content entries={entries} reloadEntries={reloadEntries} />
        <Footer reloadEntries={reloadEntries} />
      </div>
    )
  } else {
    return <Login setToken={setToken} />
  }
}

export default App
