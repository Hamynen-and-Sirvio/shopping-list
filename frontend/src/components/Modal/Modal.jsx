import { useEffect, useState } from 'react'
import './Modal.css'

const Modal = ({
  entryService,
  openModal,
  handleCloseModal,
  entry,
  reloadEntries,
  editEntry,
}) => {
  const [editField, setEditField] = useState('')

  useEffect(() => {
    if (entry) {
      setEditField(entry.content)
    }
  }, [entry])

  const handleSave = async (e) => {
    e.preventDefault()
    editEntry(entry, editField)
    handleCloseModal()
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
            <label htmlFor="edit-field">Content</label>
            <input
              type="text"
              className="edit-field"
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Modal
