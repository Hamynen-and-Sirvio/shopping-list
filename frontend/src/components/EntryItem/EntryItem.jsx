import {
  MdMoreHoriz,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md'
import { useSortable } from '@dnd-kit/react/sortable'
import './EntryItem.css'

const EntryItem = ({ index, entry, handleOpenModal, checkEntry }) => {
  const { ref } = useSortable({
    id: entry.id,
    index: index,
  })

  const handleModal = () => {
    handleOpenModal(entry)
  }

  return (
    <div className="entry-container" ref={ref}>
      <div
        className={`entry-text ${entry.checked ? 'checked' : ''}`}
        onClick={() => checkEntry(entry)}
      >
        <span className="checkbox-icon">
          {entry.checked ? (
            <MdOutlineCheckBox />
          ) : (
            <MdOutlineCheckBoxOutlineBlank />
          )}
        </span>
        <div className="entry-content">
          <span className="entry-title">{entry.content}</span>
          <span className="entry-subtitle">
            {`${entry.quantity} ${entry.unit}`}
            {entry.additionalInfo ? `, ${entry.additionalInfo}` : ''}
          </span>
        </div>
      </div>
      <div className="entry-actions">
        <span className="entry-info" onClick={handleModal}>
          <MdMoreHoriz />
        </span>
      </div>
    </div>
  )
}

export default EntryItem
