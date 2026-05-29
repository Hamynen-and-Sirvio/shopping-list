import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import './Modal.css'

const Modal = ({ entryService, openModal, handleCloseModal, entry }) => {
  const [editField, setEditField] = useState('')

  const queryClient = useQueryClient()

  useEffect(() => {
    if (entry) {
      setEditField(entry.content)
    }
  }, [entry])

  const editEntryMutation = useMutation({
    mutationFn: ({ entry, content }) => entryService.editEntry(entry, content),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['entries'],
      })

      handleCloseModal()
    },
  })

  const handleSave = (e) => {
    e.preventDefault()
    editEntryMutation.mutate({
      entry,
      content: editField,
    })
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
