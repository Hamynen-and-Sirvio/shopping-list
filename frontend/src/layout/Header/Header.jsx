import { LuTrash } from 'react-icons/lu'
import './Header.css'

const Header = ({ deleteEntries, checkedEntries }) => {
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
          onClick={deleteEntries}
          disabled={checkedEntries.length === 0}
        >
          <LuTrash size={18} />
        </button>
      </div>
    </div>
  )
}

export default Header
