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
        <span className="entry-content">{entry.content}</span>
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
