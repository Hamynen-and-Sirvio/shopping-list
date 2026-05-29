import { useState } from 'react'
import './Footer.css'

const Footer = ({ addEntry }) => {
  const [newEntryField, setNewEntryField] = useState('')

  const handleAddEntry = (event) => {
    event.preventDefault()
    if (newEntryField.trim() === '') return
    addEntry(newEntryField.trim())
    setNewEntryField('')
  }

  return (
    <div className="footer">
      <div className="add-content-container">
        <form onSubmit={handleAddEntry}>
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
