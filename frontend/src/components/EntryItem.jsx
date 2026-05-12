import { useState } from 'react'
import { CiCircleMore, CiStop1, CiSquareCheck } from 'react-icons/ci'
import { useSortable } from '@dnd-kit/react/sortable'
import entryService from '../services/entryService'
import '../components/EntryItem.css'

const EntryItem = ({ entry, index, reloadEntries, handleOpenModal }) => {
  const { ref } = useSortable({
    id: entry.id,
    index: index,
  })

  const handleCheck = async () => {
    try {
      await entryService.checkEntry(entry)
      await reloadEntries()
    } catch (error) {
      console.error(error)
    }
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
