import { LuMinus, LuPlus } from 'react-icons/lu'
import './Sheet.css'

const UNITS = ['kpl', 'pkt', 'prk', 'plo', 'kg', 'g', 'l', 'dl']

const keepFocus = (e) => e.preventDefault()

export const QuantityStepper = ({ id, quantity, setQuantity }) => {
  const parsedQuantity = parseFloat(quantity)

  const stepQuantity = (amount) => {
    const current = Number.isNaN(parsedQuantity) ? 1 : parsedQuantity
    setQuantity(String(Math.max(1, current + amount)))
  }

  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="stepper-button"
        onMouseDown={keepFocus}
        onClick={() => stepQuantity(-1)}
        disabled={!(parsedQuantity > 1)}
      >
        <LuMinus size={18} />
      </button>
      <input
        id={id}
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
        onMouseDown={keepFocus}
        onClick={() => stepQuantity(1)}
      >
        <LuPlus size={18} />
      </button>
    </div>
  )
}

export const UnitPicker = ({ unit, setUnit }) => {
  return (
    <div className="unit-grid" role="radiogroup">
      {UNITS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          className={`unit-option ${unit === option ? 'selected' : ''}`}
          onMouseDown={keepFocus}
          onClick={() => setUnit(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
