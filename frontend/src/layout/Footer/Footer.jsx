import { useState } from 'react'
import './Footer.css'

const Footer = ({ addEntry }) => {
  const [newEntryField, setNewEntryField] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (newEntryField.trim() === '') return
    try {
      addEntry(newEntryField.trim())
      setNewEntryField('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="footer">
      <div className="add-content-container">
        <form onSubmit={handleSubmit}>
          <input
            value={newEntryField}
            onChange={(event) => setNewEntryField(event.target.value)}
            placeholder="Add a new entry..."
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
