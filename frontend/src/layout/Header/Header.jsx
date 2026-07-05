import { MdOutlineSettings } from 'react-icons/md'
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
          Delete
        </button>
        <button className="settings-button">
          <MdOutlineSettings size={20} />
        </button>
      </div>
    </div>
  )
}

export default Header
