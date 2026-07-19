import { useState } from 'react'
import EntryItem from '../../components/EntryItem/EntryItem'
import EditModal from '../../components/Modal/EditModal'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import './Content.css'

const Content = ({ entries, isLoading, editEntry, moveEntry, checkEntry }) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  const handleDragEnd = async (event) => {
    if (event.canceled) return

    const { source } = event.operation

    if (isSortable(source)) {
      const { initialIndex, index } = source

      if (initialIndex !== index) {
        moveEntry(entries[initialIndex], index - initialIndex)
      }
    }
  }

  const handleOpenModal = (entry) => {
    setCurrentEntry(entry)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setCurrentEntry(null)
    setOpenModal(false)
  }

  return (
    <div className={`content ${isLoading ? 'content-disabled' : ''}`}>
      <div className="content-list">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {entries.map((entry, index) => (
            <EntryItem
              key={entry.id}
              index={index}
              entry={entry}
              handleOpenModal={handleOpenModal}
              checkEntry={checkEntry}
            />
          ))}
        </DragDropProvider>
      </div>
      <EditModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        entry={currentEntry}
        editEntry={editEntry}
      />
    </div>
  )
}

export default Content
