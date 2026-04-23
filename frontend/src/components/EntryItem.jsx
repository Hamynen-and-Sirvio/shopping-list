import { useState } from 'react'
import { CiStop1, CiSquareCheck } from 'react-icons/ci'
import { useSortable } from '@dnd-kit/react/sortable'
import entryService from '../services/entryService'

const EntryItem = ({ entry, reloadEntries }) => {
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

  return (
    <div className="entry-container" ref={ref}>
      <div className={`entry-text ${entry.checked ? 'checked' : ''}`}>
        <span className="checkbox-icon" onClick={handleCheck}>
          {entry.checked ? <CiSquareCheck /> : <CiStop1 />}
        </span>
        {entry.content}
      </div>
    </div>
  )
}

export default EntryItem
