import { useState } from 'react'
import { LuTrash } from 'react-icons/lu'
import EntryItem from '../../components/EntryItem/EntryItem'
import EditModal from '../../components/Modal/EditModal'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import './Content.css'

const Content = ({
  entries,
  isLoading,
  editEntry,
  moveEntry,
  checkEntry,
  deleteEntries,
  deleteEntry,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  const uncheckedEntries = entries.filter((entry) => !entry.checked)
  const checkedEntries = entries.filter((entry) => entry.checked)

  const handleDragEnd = async (event) => {
    if (event.canceled) return

    const { source } = event.operation

    if (isSortable(source)) {
      const { initialIndex, index } = source

      if (initialIndex !== index) {
        const movedEntry = uncheckedEntries[initialIndex]
        const targetEntry = uncheckedEntries[index]
        moveEntry(movedEntry, targetEntry.position - movedEntry.position)
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
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="section-header">
          <span className="section-label">To get</span>
          <span className="section-label">Quantity</span>
        </div>
        <div className="content-list">
          {uncheckedEntries.map((entry, index) => (
            <EntryItem
              key={entry.id}
              index={index}
              entry={entry}
              handleOpenModal={handleOpenModal}
              checkEntry={checkEntry}
            />
          ))}
          {uncheckedEntries.length === 0 && (
            <div className="content-empty">Nothing to get</div>
          )}
        </div>

        {checkedEntries.length > 0 && (
          <div className="picked-section">
            <div className="section-header">
              <span className="section-label">
                Picked · {checkedEntries.length}
              </span>
              <button className="clear-picked-button" onClick={deleteEntries}>
                <LuTrash size={18} />
                Clear picked
              </button>
            </div>
            <div className="content-list">
              {checkedEntries.map((entry, index) => (
                <EntryItem
                  key={entry.id}
                  index={index}
                  entry={entry}
                  handleOpenModal={handleOpenModal}
                  checkEntry={checkEntry}
                />
              ))}
            </div>
          </div>
        )}
      </DragDropProvider>
      <EditModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        entry={currentEntry}
        editEntry={editEntry}
        deleteEntry={deleteEntry}
      />
    </div>
  )
}

export default Content
