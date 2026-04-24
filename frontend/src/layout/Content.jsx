import { useState } from 'react'
import EntryItem from '../components/EntryItem'
import Modal from '../components/Modal'
import { DragDropProvider } from '@dnd-kit/react'
import entryService from '../services/entryService'
import '../App.css'

const Content = ({ entries, reloadEntries }) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  const handleDragEnd = (event) => {
    if (event.canceled) return
    const { source } = event.operation
    const { initialIndex, index } = source
    entryService.moveEntry(entries[initialIndex], index - initialIndex)
    reloadEntries()
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
    <div className="content">
      <div className="content-list">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              reloadEntries={reloadEntries}
              handleOpenModal={handleOpenModal}
            />
          ))}
        </DragDropProvider>
      </div>
      <Modal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        entry={currentEntry}
        reloadEntries={reloadEntries}
      />
    </div>
  )
}

export default Content
