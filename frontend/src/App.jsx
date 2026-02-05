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
  const [checkedEntries, setCheckedEntries] = useState([])

  const reloadEntries = async () => {
    const response = await fetch(
      '/api/entries',
      { headers: { 'Authorization': `Bearer ${token}` } },
    )
    const fetchedEntries = await response.json()
    setEntries(fetchedEntries)
    setCheckedEntries(fetchedEntries.filter(entry => entry.checked).map(entry => entry.id))
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

  const cancelEditEntry = () => {
    return async (event) => {
      event.preventDefault()
      setEditEntryId(-1)
      setEditEntryField('')
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
      if (checkedEntries.includes(entry.id)) {
        setCheckedEntries(checkedEntries.filter(id => id !== entry.id))
      } else {
        setCheckedEntries(checkedEntries.concat(entry.id))
      }
      reloadEntries()
    }
  }

  const deleteCheckedEntries = async (event) => {
    event.preventDefault()
    if (confirm(`Delete ${checkedEntries.length} checked entries?`)) {
      for (const entryId of checkedEntries) {
        await fetch(
          `/api/entries/${entryId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          },
        )
      }
      setCheckedEntries([])
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
      <div className="app-container">
        <div className="header">
          <div className="header-buttons">
            <button
              className="delete-button"
              onClick={deleteCheckedEntries}
              disabled={checkedEntries.length === 0}
            >
              Delete
            </button>
            <button
              className={`edit-button ${editMode ? "active" : ""}`}
              aria-pressed={editMode}
              onClick={() => setEditMode(prev => !prev)}
            >
              {editMode ? "Done" : "Edit"}
            </button>
          </div>
        </div>
        <div className="content">
          <div className="content-header">
            <h1 className="title">Shopping list</h1>
          </div>
          <div className="content-list">
            {entries.map(entry =>
              <div
                key={entry.id}
                className="entry-container"
              >
                <div
                  key={entry.id}
                  className={`list-entry ${entry.checked ? 'checked' : ''}`}
                  onClick={checkEntry(entry)}
                >
                  {entry.id === editEntryId ?
                    <div className="entry-text">
                      <form onSubmit={editEntry(entry)} onClick={(e) => e.stopPropagation()}>
                        <input
                          value={editEntryField}
                          onChange={event => setEditEntryField(event.target.value)}
                        />
                        <button
                          type="submit"
                          className='save-button'
                          onClick={(e) => e.stopPropagation()}
                          hidden
                        >
                          Save
                        </button>
                      </form>
                    </div> :
                    <div className="entry-text">
                      {entry.content}
                    </div>
                  }
                  {editMode && (
                    <div className="edit-container" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        className="entry-edit-button"
                        onClick={
                          editEntryId === -1
                            ? selectEditEntry(entry)
                            : cancelEditEntry(entry)
                        }
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="entry-edit-button"
                        disabled={entry.position <= 1}
                        onClick={moveEntry(entry, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="entry-edit-button"
                        disabled={entry.position >= entries.length}
                        onClick={moveEntry(entry, 1)}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="footer">
          <div className="add-content-container">
            <form onSubmit={addEntry}>
              <input
                value={newEntryField}
                onChange={event => setNewEntryField(event.target.value)}
                placeholder="New entry"
              />
              <button type="submit" hidden>+</button>
            </form>
          </div>
        </div>
      </div>
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
