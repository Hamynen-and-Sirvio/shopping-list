import { LuTrash } from 'react-icons/lu'
import './Header.css'

const Header = ({ entryService, checkedEntries, reloadEntries }) => {
  const deleteCheckedEntries = async (event) => {
    event.preventDefault()
    if (!confirm(`Delete ${checkedEntries.length} checked entries?`)) return

    try {
      await entryService.deleteEntries(checkedEntries)
      await reloadEntries()
    } catch (error) {
      console.error(error)
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
