import { useState } from 'react'
import { LuShoppingCart } from 'react-icons/lu'
import { MdOutlineSettings } from 'react-icons/md'
import { LuTrash } from 'react-icons/lu'
import SettingsModal from '../../components/Modal/SettingsModal'
import './Header.css'

const Header = ({ deleteEntries, checkedEntries, logout }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <>
      <div className="header">
        <div className="header-title">
          <div className="title-icon">
            <LuShoppingCart size={23} />
          </div>
          <div className="title-text">
            <a href="/" className="title-link">
              Shopping list
            </a>
          </div>
        </div>
        <div className="header-buttons">
          <button
            className={`delete-button ${checkedEntries.length === 0 ? 'disabled' : ''}`}
            onClick={deleteEntries}
            disabled={checkedEntries.length === 0}
          >
            <LuTrash size={20} />
          </button>
          <button className="settings-button" onClick={handleOpenModal}>
            <MdOutlineSettings size={20} />
          </button>
        </div>
      </div>
      <SettingsModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        logout={logout}
      />
    </>
  )
}

export default Header
