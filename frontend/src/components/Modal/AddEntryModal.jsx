import { useRef, useState } from 'react'
import { LuCheck, LuMinus, LuPlus, LuX } from 'react-icons/lu'
import './AddEntryModal.css'

const UNITS = ['kpl', 'pkt', 'prk', 'plo', 'kg', 'g', 'l', 'dl']

const AddEntryModal = ({ openModal, handleCloseModal, addEntry }) => {
  const [content, setContent] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('kpl')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [success, setSuccess] = useState(false)
  const contentRef = useRef(null)

  const parsedQuantity = parseFloat(quantity)
  const canSubmit = content.trim() !== '' && parsedQuantity > 0

  const stepQuantity = (amount) => {
    const current = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity
    setQuantity(String(Math.max(1, current + amount)))
  }

  const handleAdd = (e) => {
    e.preventDefault()

    if (!canSubmit) return

    addEntry({
      content: content.trim(),
      quantity: parsedQuantity,
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
    }, 2000)
  }

  if (!openModal) return null

  return (
    <div className="sheet-overlay" onClick={handleCloseModal}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-header">
          <h2 id="add-item-title" className="sheet-title">
            Add item
          </h2>
          <button
            type="button"
            className="sheet-close-button"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <LuX size={22} />
          </button>
        </div>

        <form className="sheet-form" onSubmit={handleAdd}>
          <div className="sheet-field">
            <div className="sheet-label-row">
              <label htmlFor="add-content" className="sheet-label">
                Item
              </label>
              <span className={`sheet-success ${success ? 'show' : ''}`}>
                Added to list
              </span>
            </div>
            <input
              id="add-content"
              className="sheet-input sheet-input-large"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What should be added?"
              autoComplete="off"
              required
              autoFocus
              ref={contentRef}
            />
          </div>

          <div className="sheet-field">
            <label htmlFor="add-quantity" className="sheet-label">
              Quantity
            </label>
            <div className="quantity-stepper">
              <button
                type="button"
                className="stepper-button"
                onClick={() => stepQuantity(-1)}
                disabled={!(parsedQuantity > 1)}
                aria-label="Decrease quantity"
              >
                <LuMinus size={22} />
              </button>
              <input
                id="add-quantity"
                className="stepper-input"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <button
                type="button"
                className="stepper-button"
                onClick={() => stepQuantity(1)}
                aria-label="Increase quantity"
              >
                <LuPlus size={22} />
              </button>
            </div>
          </div>

          <div className="sheet-field">
            <span id="add-unit-label" className="sheet-label">
              Unit
            </span>
            <div
              className="unit-grid"
              role="radiogroup"
              aria-labelledby="add-unit-label"
            >
              {UNITS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={unit === option}
                  className={`unit-option ${unit === option ? 'selected' : ''}`}
                  onClick={() => setUnit(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="sheet-field">
            <label htmlFor="add-info" className="sheet-label">
              Note
            </label>
            <input
              id="add-info"
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
            Add to list
            <LuCheck size={24} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddEntryModal
