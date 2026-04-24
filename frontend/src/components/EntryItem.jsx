import { useState } from 'react'
import { CiCircleMore, CiStop1, CiSquareCheck } from 'react-icons/ci'
import { useSortable } from '@dnd-kit/react/sortable'
import entryService from '../services/entryService'

const EntryItem = ({ entry, reloadEntries, handleOpenModal }) => {
  const { ref } = useSortable({
    id: entry.id,
    index: entry.position - 1,
  })

  const handleCheck = async () => {
    await entryService.checkEntry(entry)
    reloadEntries()
  }

  const handleMove = async (amount) => {
    await entryService.moveEntry(entry, amount)
    reloadEntries()
  }

  const handleModal = () => {
    handleOpenModal(entry)
  }

  return (
    <div className="entry-container" ref={ref}>
      <div
        className={`entry-text ${entry.checked ? 'checked' : ''}`}
        onClick={handleCheck}
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
