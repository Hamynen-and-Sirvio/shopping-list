import { useRef, useState } from 'react'
import './Modal.css'

const AddEntryModal = ({ openModal, handleCloseModal, addEntry }) => {
  const [content, setContent] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('kpl')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [success, setSuccess] = useState(false)
  const contentRef = useRef(null)

  const handleAdd = (e) => {
    e.preventDefault()

    if (!content.trim()) return

    addEntry({
      content: content.trim(),
      quantity: parseFloat(quantity),
      unit,
      additionalInfo: additionalInfo.trim(),
    })

    setContent('')
    setQuantity('1')
    setUnit('kpl')
    setAdditionalInfo('')

    setSuccess(true)

    setTimeout(() => {
      contentRef.current?.focus()
    }, 0)

    setTimeout(() => {
      setSuccess(false)
      contentRef.current?.focus()
    }, 2000)
  }

  if (!openModal) return null

  return (
    <div className="modal" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h3>Add Entry</h3>
        </div>

        <div className="modal-edit-entry">
          <form onSubmit={handleAdd}>
            <div className="label-row">
              <label htmlFor="content">Content</label>

              <span className={`success-message ${success ? 'show' : ''}`}>
                Entry added successfully
              </span>
            </div>
            <input
              id="content"
              className="edit-field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              autoFocus
              ref={contentRef}
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
                  min="1"
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
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEntryModal
