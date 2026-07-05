import { useState } from 'react'
import { MdOutlineSettings } from 'react-icons/md'
import SettingsModal from '../../components/Modal/SettingsModal'
import './Header.css'

const Header = ({ deleteEntries, checkedEntries }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
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
          onClick={deleteEntries}
          disabled={checkedEntries.length === 0}
        >
          Delete
        </button>
        <button className="settings-button" onClick={handleOpenModal}>
          <MdOutlineSettings size={20} />
        </button>
      </div>
      <SettingsModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
      />
    </div>
  )
}

export default Header
