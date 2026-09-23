import { useState } from 'react'
import { LuSettings } from 'react-icons/lu'
import SettingsModal from '../../components/Modal/SettingsModal'
import './Header.css'

const Header = ({ uncheckedCount, checkedCount, isLoading, logout }) => {
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
          <h1 className="title-text">
            <a href="/" className="title-link">
              Shopping list
            </a>
          </h1>
          <span className="header-summary">
            {isLoading
              ? 'Updating list...'
              : `${uncheckedCount} to get · ${checkedCount} picked`}
          </span>
        </div>
        <button className="header-settings-button" onClick={handleOpenModal}>
          <LuSettings size={20} />
        </button>
        {isLoading && (
          <div className="loading-track">
            <div className="loading-bar" />
          </div>
        )}
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
