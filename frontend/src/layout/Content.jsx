import EntryItem from '../components/EntryItem'
import { DragDropProvider } from '@dnd-kit/react'
import entryService from '../services/entryService'
import '../App.css'

const Content = ({ entries, editMode, reloadEntries }) => {
  const handleDragEnd = (event) => {
    if (event.canceled) return
    const { source } = event.operation
    const { initialIndex, index } = source
    entryService.moveEntry(entries[initialIndex], index - initialIndex)
    reloadEntries()
  }

  return (
    <div className="content">
      <div className="content-list">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {entries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              editMode={editMode}
              reloadEntries={reloadEntries}
            />
          ))}
        </DragDropProvider>
      </div>
    </div>
  )
}

export default Content
