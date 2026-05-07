import { useState } from 'react'
import EntryItem from '../components/EntryItem'
import Modal from '../components/Modal'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import entryService from '../services/entryService'
import '../App.css'

const Content = ({ entries, reloadEntries }) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  const handleDragEnd = async (event) => {
    if (event.canceled) return

    const { source } = event.operation

    if (isSortable(source)) {
      const { initialIndex, index } = source

      if (initialIndex !== index) {
        try {
          await entryService.moveEntry(
            entries[initialIndex],
            index - initialIndex,
          )
          await reloadEntries()
        } catch (error) {
          console.error(error)
        }
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
    <div className="content">
      <div className="content-list">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {entries.map((entry, index) => (
            <EntryItem
              key={entry.id}
              index={index}
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
