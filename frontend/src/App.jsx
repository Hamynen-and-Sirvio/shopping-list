import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
  const [entries, setEntries] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [newEntryField, setNewEntryField] = useState('')
  const [editEntryId, setEditEntryId] = useState(-1)
  const [editEntryField, setEditEntryField] = useState('')
  const [passwordField, setPasswordField] = useState('')
  const [token, setToken] = useState('')

  const reloadEntries = async () => {
    const response = await fetch(
      '/api/entries',
      { headers: { 'Authorization': `Bearer ${token}` } },
    )
    const fetchedEntries = await response.json()
    setEntries(fetchedEntries)
  }

  useEffect(() => {
    const curToken = localStorage.getItem('token')
    if (curToken) {
      setToken(curToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      reloadEntries()
    }
  }, [token])

  const addEntry = async (event) => {
    event.preventDefault()
    const response = await fetch(
      '/api/entries',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newEntryField }),
      },
    )
    const addedEntry = await response.json()
    setEntries(entries.concat(addedEntry))
    setNewEntryField('')
  }

  const deleteEntry = entry => {
    return async (event) => {
      event.preventDefault()
      if (confirm(`Delete "${entry.content}"?`)) {
        await fetch(
          `/api/entries/${entry.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          },
        )
        reloadEntries()
      }
    }
  }

  const moveEntry = (entry, amount) => {
    return async (event) => {
      event.preventDefault()
      await fetch(
        `/api/entries/${entry.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ position: entry.position + amount }),
        },
      )
      reloadEntries()
    }
  }

  const selectEditEntry = entry => {
    return async (event) => {
      event.preventDefault()
      setEditEntryId(entry.id)
      setEditEntryField(entry.content)
    }
  }

  const editEntry = entry => {
    return async (event) => {
      event.preventDefault()
      const response = await fetch(
        `/api/entries/${entry.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editEntryField }),
        },
      )
      const editedEntry = await response.json()
      entry.content = editedEntry.content
      setEditEntryField('')
      setEditEntryId(-1)
    }
  }

  const checkEntry = entry => {
    return async (event) => {
      event.preventDefault()
      const response = await fetch(
        `/api/entries/${entry.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ checked: !entry.checked }),
        },
      )
      const checkedEntry = await response.json()
      entry.checked = checkedEntry.checked
      reloadEntries()
    }
  }

  const logIn = async (event) => {
    event.preventDefault()
    const response = await fetch(
      `/api/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordField }),
      },
    )
    const loginData = await response.json()
    localStorage.setItem('token', loginData.token)
    setToken(loginData.token)
    await reloadEntries()
  }

  if (token) {
    return (
      <>
        <div className="app-container">
          <div className="header">
            <h1 className="title">Shopping list</h1>
            <button
              className="edit-button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Done" : "Edit"}
            </button>
          </div>
          <div className='shopping-list'>
            {entries.map(entry =>
              <div
                key={entry.id}
                className={`list-entry ${entry.checked ? 'checked' : ''}`}
                onClick={checkEntry(entry)}
              >
                {entry.id === editEntryId ?
                  <form onSubmit={editEntry(entry)} onClick={(e) => e.stopPropagation()}>
                    <input
                      value={editEntryField}
                      onChange={event => setEditEntryField(event.target.value)}
                    />
                    <button
                      type="submit"
                      className='save-button'
                      onClick={(e) => e.stopPropagation()}
                    >
                      Save
                    </button>
                  </form> :
                  <div className="entry-text">
                    {entry.content}
                  </div>
                }
                {editMode && (
                <div className='entry-edit-buttons'>
                  <form onSubmit={deleteEntry(entry)}>
                    <button type="submit" onClick={(e) => e.stopPropagation()}>🗑</button>
                  </form>
                  {entry.position > 1 &&
                    <form onSubmit={moveEntry(entry, -1)}>
                      <button type="submit" onClick={(e) => e.stopPropagation()}>↑</button>
                    </form>
                  }
                  {entry.position < entries.length &&
                    <form onSubmit={moveEntry(entry, 1)}>
                      <button type="submit" onClick={(e) => e.stopPropagation()}>↓</button>
                    </form>
                  }
                  <form onSubmit={selectEditEntry(entry)}>
                    <button type="submit" onClick={(e) => e.stopPropagation()}>✎</button>
                  </form>
                </div>
                )}
              </div>
            )}
          </div>
          <div className='add-row'>
            <form onSubmit={addEntry}>
              <input
                value={newEntryField}
                onChange={event => setNewEntryField(event.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          </div>
        </div>
      </>
    )
  } else {
    return (
      <>
        <form onSubmit={logIn}>
          <input
            type="password"
            placeholder="Password"
            minLength="5"
            maxLength="50"
            value={passwordField}
            onChange={event => setPasswordField(event.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </>
    )
  }
}

export default App
