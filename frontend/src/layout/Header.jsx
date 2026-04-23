import entryService from '../services/entryService'
import { LuTrash } from 'react-icons/lu'
import '../App.css'

const Header = ({ checkedEntries, setCheckedEntries, reloadEntries }) => {
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
      <div className="header-title">
        <h1 className="title">
          <a href="/" className="title-link">
            Shopping list
          </a>
        </h1>
      </div>
      <div className="header-buttons">
        <button
          className={`delete-button ${checkedEntries.length === 0 ? 'disabled' : ''}`}
          onClick={deleteCheckedEntries}
          disabled={checkedEntries.length === 0}
        >
          <LuTrash size={18} />
        </button>
      </div>
    </div>
  )
}

export default Header
