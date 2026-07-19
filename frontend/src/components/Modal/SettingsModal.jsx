import { MdLogout, MdSort } from 'react-icons/md'
import './Modal.css'

const SettingsModal = ({ openModal, handleCloseModal, logout }) => {
  if (!openModal) return null
  return (
    <div className="modal" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <h3>Settings</h3>
        </div>
        <div className="modal-settings">
          <button className="settings-button">
            <MdSort size={20} /> Auto sort entries
          </button>
          <button className="settings-button" onClick={logout}>
            <MdLogout size={20} /> Logout
          </button>
        </div>
        <div className="modal-settings">
          <button className="close-button" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
