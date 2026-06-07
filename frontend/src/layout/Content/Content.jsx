import { useState } from 'react'
import EntryItem from '../../components/EntryItem/EntryItem'
import Modal from '../../components/Modal/Modal'
import Loading from '../../components/Loading/Loading'
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

  if (isLoading) return <Loading />

  return (
    <div className="content">
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
      <Modal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        entry={currentEntry}
        editEntry={editEntry}
      />
    </div>
  )
}

export default Content
