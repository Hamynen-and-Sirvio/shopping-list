import { useEffect, useState } from 'react'

const addEntry = () => {
  
}

const App = () => {
  const [entries, setEntries] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [newEntryField, setNewEntryField] = useState('')
  const [editEntryId, setEditEntryId] = useState(-1)
  const [editEntryField, setEditEntryField] = useState('')

  const reloadEntries = async () => {
    setEntries(await (await fetch('/api/entries')).json())
  }

  useEffect(() => {
    reloadEntries()
  }, [])

  const addEntry = async (event) => {
    event.preventDefault()
    const response = await fetch(
      '/api/entries',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      await fetch(`/api/entries/${entry.id}`, { method: 'DELETE' })
      reloadEntries()
    }
  }

  const moveEntry = (entry, amount) => {
    return async (event) => {
      event.preventDefault()
      await fetch(
        `/api/entries/${entry.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editEntryField }),
        },
      )
      const editedEntry = await response.json()
      entry.content = editedEntry.content
      setEditEntryField('')
      setEditEntryId(-1)
    }
  }

  return (
    <>
      <div>
        {entries.map(entry =>
          <div key={entry.id}>
            {entry.id === editEntryId ?
              <form style={{ display: 'inline-block' }} onSubmit={editEntry(entry)}>
                <input
                  value={editEntryField}
                  onChange={event => setEditEntryField(event.target.value)}
                />
                <button type="submit">Save</button>
              </form> :
              entry.content
            }
            <form style={{ display: 'inline-block' }} onSubmit={deleteEntry(entry)}>
              <button type="submit">🗑</button>
            </form>
            {entry.position > 1 &&
              <form style={{ display: 'inline-block' }} onSubmit={moveEntry(entry, -1)}>
                <button type="submit">↑</button>
              </form>
            }
            {entry.position < entries.length &&
              <form style={{ display: 'inline-block' }} onSubmit={moveEntry(entry, 1)}>
                <button type="submit">↓</button>
              </form>
            }
            <form style={{ display: 'inline-block' }} onSubmit={selectEditEntry(entry)}>
              <button type="submit">✎</button>
            </form>
          </div>
        )}
      </div>
      <form onSubmit={addEntry}>
        <input
          value={newEntryField}
          onChange={event => setNewEntryField(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </>
  )
}

export default App
