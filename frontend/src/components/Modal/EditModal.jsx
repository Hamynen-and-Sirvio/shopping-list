import { useEffect, useState } from 'react'
import { LuCheck, LuTrash, LuX } from 'react-icons/lu'
import { QuantityStepper, UnitPicker } from './SheetFields'
import './Sheet.css'

const EditModal = ({
  openModal,
  handleCloseModal,
  entry,
  editEntry,
  deleteEntry,
}) => {
  const [content, setContent] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  useEffect(() => {
    if (entry) {
      setContent(entry.content ?? '')
      setQuantity(String(entry.quantity ?? ''))
      setUnit(entry.unit ?? '')
      setAdditionalInfo(entry.additionalInfo ?? '')
    }
  }, [entry])

  const parsedQuantity = parseFloat(quantity)
  const canSubmit = content.trim() !== '' && parsedQuantity > 0

  const handleSave = (e) => {
    e.preventDefault()

    if (!canSubmit) return

    editEntry(entry, {
      content: content.trim(),
      quantity: parsedQuantity,
      unit: unit,
      additionalInfo: additionalInfo.trim(),
    })

    handleCloseModal()
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${entry.content}"?`)) return
    handleCloseModal()
    await deleteEntry(entry)
  }

  if (!openModal || !entry) return null

  return (
    <div className="sheet-overlay" onClick={handleCloseModal}>
      <div className="sheet" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <h2 id="edit-item-title" className="sheet-title">
            Edit item
          </h2>
          <div className="sheet-header-actions">
            <button
              type="button"
              className="sheet-close-button sheet-delete-button"
              onClick={handleDelete}
            >
              <LuTrash size={22} />
            </button>
            <button
              type="button"
              className="sheet-close-button"
              onClick={handleCloseModal}
            >
              <LuX size={22} />
            </button>
          </div>
        </div>

        <form className="sheet-form" onSubmit={handleSave}>
          <div className="sheet-field">
            <label htmlFor="edit-content" className="sheet-label">
              Item
            </label>
            <input
              id="edit-content"
              className="sheet-input sheet-input-large"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="sheet-field">
            <label htmlFor="edit-quantity" className="sheet-label">
              Quantity
            </label>
            <QuantityStepper
              id="edit-quantity"
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>

          <div className="sheet-field">
            <span id="edit-unit-label" className="sheet-label">
              Unit
            </span>
            <UnitPicker
              labelId="edit-unit-label"
              unit={unit}
              setUnit={setUnit}
            />
          </div>

          <div className="sheet-field">
            <label htmlFor="edit-info" className="sheet-label">
              Note
            </label>
            <input
              id="edit-info"
              className="sheet-input"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Additional info"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="sheet-submit-button"
            disabled={!canSubmit}
          >
            Save
            <LuCheck size={24} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditModal
