import { useState } from "react"
import {
  LiaChevronDownSolid,
  LiaChevronUpSolid,
  LiaEditSolid,
} from "react-icons/lia"
import entryService from "../services/entryService"
import "../App.css"

const Content = ({ entries, editMode, reloadEntries }) => {
  const [editEntryId, setEditEntryId] = useState(-1)
  const [editEntryField, setEditEntryField] = useState("")

  const checkEntry = (entry) => {
    return async (event) => {
      event.preventDefault()
      await entryService.checkEntry(entry)
      reloadEntries()
    }
  }

  const moveEntry = (entry, amount) => {
    return async (event) => {
      event.preventDefault()
      await entryService.moveEntry(entry, amount)
      reloadEntries()
    }
  }

  const selectEditEntry = (entry) => {
    return async (event) => {
      event.preventDefault()
      setEditEntryId(entry.id)
      setEditEntryField(entry.content)
    }
  }

  const cancelEditEntry = () => {
    return async (event) => {
      event.preventDefault()
      setEditEntryId(-1)
      setEditEntryField("")
    }
  }

  const editEntry = (entry) => {
    return async (event) => {
      event.preventDefault()
      await entryService.editEntry(entry, editEntryField)
      setEditEntryField("")
      setEditEntryId(-1)
      reloadEntries()
    }
  }

  return (
    <div className="content">
      <div className="content-header">
        <h1 className="title">
          <a href="/" className="title-link">
            Shopping list
          </a>
        </h1>
      </div>
      <div className="content-list">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="entry-container"
            onClick={checkEntry(entry)}
          >
            {entry.id === editEntryId ? (
              <div className="entry-text-edit">
                <form
                  onSubmit={editEntry(entry)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    value={editEntryField}
                    onChange={(event) => setEditEntryField(event.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="save-button"
                    onClick={(e) => e.stopPropagation()}
                    hidden
                  >
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <div className={`entry-text ${entry.checked ? "checked" : ""}`}>
                {entry.content}
              </div>
            )}
            {editMode && (
              <div
                className="edit-container"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="entry-edit-button"
                  onClick={
                    editEntryId === -1
                      ? selectEditEntry(entry)
                      : cancelEditEntry(entry)
                  }
                >
                  <LiaEditSolid />
                </button>
                <button
                  type="button"
                  className="entry-edit-button"
                  disabled={entry.position <= 1}
                  onClick={moveEntry(entry, -1)}
                >
                  <LiaChevronUpSolid />
                </button>
                <button
                  type="button"
                  className="entry-edit-button"
                  disabled={entry.position >= entries.length}
                  onClick={moveEntry(entry, 1)}
                >
                  <LiaChevronDownSolid />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Content
