import { useState } from "react"
import { LiaChevronDownSolid, LiaChevronUpSolid } from "react-icons/lia"
import { useSortable } from "@dnd-kit/react/sortable"
import entryService from "../services/entryService"

const EntryItem = ({ entry, entriesLength, editMode, reloadEntries }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editField, setEditField] = useState(entry.content)

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

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    await entryService.editEntry(entry, editField)
    setIsEditing(false)
    reloadEntries()
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditField(entry.content)
  }

  return (
    <div
      className="entry-container"
      onClick={editMode ? () => setIsEditing(true) : handleCheck}
      ref={ref}
    >
      {isEditing ? (
        <div className="entry-text-edit">
          <form
            onSubmit={handleEditSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              onBlur={handleCancelEdit}
              autoFocus
            />
            <button type="submit" hidden />
          </form>
        </div>
      ) : (
        <div className={`entry-text ${entry.checked ? "checked" : ""}`}>
          {entry.content}
        </div>
      )}

      {editMode && (
        <div className="edit-container" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="entry-edit-button"
            disabled={entry.position <= 1}
            onClick={() => handleMove(-1)}
          >
            <LiaChevronUpSolid />
          </button>

          <button
            type="button"
            className="entry-edit-button"
            disabled={entry.position >= entriesLength}
            onClick={() => handleMove(1)}
          >
            <LiaChevronDownSolid />
          </button>
        </div>
      )}
    </div>
  )
}

export default EntryItem
