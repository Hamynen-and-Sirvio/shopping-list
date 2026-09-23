import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import AddEntryModal from '../../components/Modal/AddEntryModal'
import './Footer.css'

const Footer = ({ addEntry }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="footer">
        <button className="add-button" onClick={() => setIsOpen(true)}>
          Add item
          <LuPlus size={26} />
        </button>
      </div>

      <AddEntryModal
        openModal={isOpen}
        handleCloseModal={() => setIsOpen(false)}
        addEntry={addEntry}
      />
    </>
  )
}

export default Footer
