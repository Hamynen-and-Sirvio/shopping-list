import { useState } from 'react'
import entryService from '../services/entryService'
import '../App.css'

const Footer = ({ reloadEntries }) => {
  const [newEntryField, setNewEntryField] = useState('')

  const addEntry = async (event) => {
    event.preventDefault()
    if (newEntryField.trim() === '') return
    try {
      await entryService.addEntry(newEntryField.trim())
      setNewEntryField('')
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="footer">
      <div className="add-content-container">
        <form onSubmit={addEntry}>
          <input
            value={newEntryField}
            onChange={(event) => setNewEntryField(event.target.value)}
            placeholder="New entry"
          />
          <button type="submit" hidden>
            +
          </button>
        </form>
      </div>
    </div>
  )
}

export default Footer
