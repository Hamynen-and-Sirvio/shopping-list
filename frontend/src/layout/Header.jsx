import entryService from "../services/entryService"
import "../App.css"

const Header = ({
  checkedEntries,
  setCheckedEntries,
  editMode,
  setEditMode,
  reloadEntries,
}) => {
  const deleteCheckedEntries = async (event) => {
    event.preventDefault()
    if (confirm(`Delete ${checkedEntries.length} checked entries?`)) {
      for (const entryId of checkedEntries) {
        await entryService.deleteEntry(entryId)
      }
      setCheckedEntries([])
      reloadEntries()
    }
  }

  return (
    <div className="header">
      <div className="header-buttons">
        <button
          className={`delete-button ${checkedEntries.length === 0 ? "disabled" : ""}`}
          onClick={deleteCheckedEntries}
          disabled={checkedEntries.length === 0}
        >
          Delete
        </button>
        <button
          className={`edit-button ${editMode ? "active" : ""}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done" : "Edit"}
        </button>
      </div>
    </div>
  )
}

export default Header
