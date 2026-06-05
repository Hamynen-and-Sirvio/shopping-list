import { useState } from 'react'
import { CiCircleMore, CiStop1, CiSquareCheck } from 'react-icons/ci'
import { useSortable } from '@dnd-kit/react/sortable'
import './EntryItem.css'

const EntryItem = ({
  entry,
  index,
  entryService,
  reloadEntries,
  handleOpenModal,
  checkEntry,
}) => {
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
          {entry.checked ? <CiSquareCheck /> : <CiStop1 />}
        </span>
        {entry.content}
      </div>
      <div className="entry-actions">
        <span className="entry-info" onClick={handleModal}>
          <CiCircleMore size={20} />
        </span>
      </div>
    </div>
  )
}

export default EntryItem
