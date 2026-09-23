import { LuCheck } from 'react-icons/lu'
import { useSortable } from '@dnd-kit/react/sortable'
import './EntryItem.css'

const DEFAULT_QUANTITY = 1
const DEFAULT_UNIT = 'kpl'

const formatQuantity = (entry) => {
  if (entry.quantity === DEFAULT_QUANTITY && entry.unit === DEFAULT_UNIT) {
    return ''
  }
  return `${entry.quantity} ${entry.unit}`.trim()
}

const EntryItem = ({ index, entry, handleOpenModal, checkEntry }) => {
  const { ref } = useSortable({
    id: entry.id,
    index: index,
    group: entry.checked ? 'picked' : 'to-get',
    disabled: entry.checked,
  })

  const quantity = formatQuantity(entry)

  return (
    <div
      className={`entry-container ${entry.checked ? 'checked' : ''}`}
      ref={ref}
    >
      <button
        className="entry-checkbox"
        onClick={() => checkEntry(entry)}
        role="checkbox"
        aria-checked={entry.checked}
        aria-label={entry.content}
      >
        <span className="checkbox-box">
          {entry.checked && <LuCheck size={16} strokeWidth={3} />}
        </span>
      </button>
      <div className="entry-body" onClick={() => handleOpenModal(entry)}>
        <div className="entry-content">
          <span className="entry-title">{entry.content}</span>
          {entry.additionalInfo && (
            <span className="entry-subtitle">{entry.additionalInfo}</span>
          )}
        </div>
        {quantity && <span className="entry-quantity">{quantity}</span>}
      </div>
    </div>
  )
}

export default EntryItem
