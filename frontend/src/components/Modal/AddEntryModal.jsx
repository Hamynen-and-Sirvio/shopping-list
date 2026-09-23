import { useRef, useState } from 'react'
import { LuCheck, LuX } from 'react-icons/lu'
import { QuantityStepper, UnitPicker } from './SheetFields'
import Sheet from './Sheet'

const AddEntryModal = ({ openModal, handleCloseModal, addEntry }) => {
  const [content, setContent] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('kpl')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [success, setSuccess] = useState(false)
  const contentRef = useRef(null)

  const parsedQuantity = parseFloat(quantity)
  const canSubmit = content.trim() !== '' && parsedQuantity > 0

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
    <Sheet handleCloseModal={handleCloseModal}>
      <div className="sheet-header">
        <h2 id="add-item-title" className="sheet-title">
          Add item
        </h2>
        <button
          type="button"
          className="sheet-close-button"
          onClick={handleCloseModal}
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
          <QuantityStepper
            id="add-quantity"
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>

        <div className="sheet-field">
          <span id="add-unit-label" className="sheet-label">
            Unit
          </span>
          <UnitPicker labelId="add-unit-label" unit={unit} setUnit={setUnit} />
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
    </Sheet>
  )
}

export default AddEntryModal
