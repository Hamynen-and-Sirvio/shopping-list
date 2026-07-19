import { useEffect, useState } from 'react'
import './Modal.css'

const EditModal = ({ openModal, handleCloseModal, entry, editEntry }) => {
  const [content, setContent] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  useEffect(() => {
    if (entry) {
      setContent(entry.content ?? '')
      setQuantity(entry.quantity ?? '')
      setUnit(entry.unit ?? '')
      setAdditionalInfo(entry.additionalInfo ?? '')
    }
  }, [entry])

  const handleSave = (e) => {
    e.preventDefault()

    if (!content.trim()) return

    editEntry(entry, {
      content: content.trim(),
      quantity: parseFloat(quantity),
      unit: unit,
      additionalInfo: additionalInfo.trim(),
    })

    handleCloseModal()
  }

  if (!openModal || !entry) return null

  return (
    <div className="modal" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h3>Edit Entry</h3>
        </div>

        <div className="modal-edit-entry">
          <form onSubmit={handleSave}>
            <label htmlFor="content">Content</label>
            <input
              id="content"
              className="edit-field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              autoFocus
            />

            <div className="quantity-row">
              <div className="field-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
                  className="edit-field"
                  type="number"
                  step="any"
                  value={quantity}
                  required
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label htmlFor="unit">Unit</label>
                <input
                  id="unit"
                  className="edit-field"
                  value={unit}
                  required
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="info">Additional info</label>
            <input
              id="info"
              className="edit-field"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Optional..."
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

export default EditModal
