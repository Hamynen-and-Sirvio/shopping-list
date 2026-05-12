import { useEffect, useState } from 'react'
import entryService from '../services/entryService'
import '../components/Modal.css'

const Modal = ({ openModal, handleCloseModal, entry, reloadEntries }) => {
  const [editField, setEditField] = useState('')

  useEffect(() => {
    if (entry) {
      setEditField(entry.content)
    }
  }, [entry])

  const handleSave = async (e) => {
    e.preventDefault()
    await entryService.editEntry(entry, editField)
    handleCloseModal()
    reloadEntries()
  }

  if (!openModal || !entry) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-title">
          <h3>Edit "{entry.content}"</h3>
        </div>
        <div className="modal-edit-entry">
          <form onSubmit={handleSave}>
            <label for="edit-field">Content</label>
            <input
              type="text"
              className="edit-field"
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button type="submit" className="save-button">
                Save
              </button>
              <button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Modal
