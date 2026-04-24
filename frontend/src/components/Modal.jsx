const Modal = ({ openModal, handleCloseModal }) => {
  if (!openModal) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Modal</h2>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  )
}

export default Modal
