import { useState } from 'react'
import { MdAddCircle } from 'react-icons/md'
import AddEntryModal from '../../components/Modal/AddEntryModal'
import './Footer.css'

const Footer = ({ addEntry }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="footer">
        <button className="add-button" onClick={() => setIsOpen(true)}>
          <MdAddCircle size={48} />
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
