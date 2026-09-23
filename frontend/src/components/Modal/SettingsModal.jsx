import { LuArrowDownWideNarrow, LuLogOut, LuX } from 'react-icons/lu'
import './Sheet.css'

const SettingsModal = ({ openModal, handleCloseModal, logout }) => {
  if (!openModal) return null
  return (
    <div className="sheet-overlay" onClick={handleCloseModal}>
      <div
        className="sheet sheet-flush"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-header">
          <h2 className="sheet-title">Settings</h2>
          <button
            type="button"
            className="sheet-close-button"
            onClick={handleCloseModal}
          >
            <LuX size={22} />
          </button>
        </div>
        <div className="settings-list">
          <button type="button" className="settings-row">
            <LuArrowDownWideNarrow size={22} className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Auto sort entries</span>
              <span className="settings-row-subtitle">TODO</span>
            </span>
          </button>
          <button type="button" className="settings-row" onClick={logout}>
            <LuLogOut size={22} className="settings-row-icon" />
            <span className="settings-row-text">
              <span className="settings-row-title">Log out</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
