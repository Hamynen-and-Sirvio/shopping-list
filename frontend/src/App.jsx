import { useState } from 'react'
import { useEntries } from './hooks/useEntries'
import Header from './layout/Header/Header'
import Content from './layout/Content/Content'
import Footer from './layout/Footer/Footer'
import Login from './layout/Login/Login'
import './App.css'

const App = ({ entryService, tokenService, userService }) => {
  const [token, setToken] = useState(tokenService.fetchToken() || '')

  const {
    entries,
    isLoading,
    error,
    addEntry,
    editEntry,
    deleteEntries,
    checkEntry,
    moveEntry,
  } = useEntries(entryService, token)

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
      <Header checkedEntries={checkedEntries} deleteEntries={deleteEntries} />
      <Content
        entries={entries}
        editEntry={editEntry}
        checkEntry={checkEntry}
        moveEntry={moveEntry}
        isLoading={isLoading}
      />
      <Footer addEntry={addEntry} />
    </div>
  )
}

export default App
