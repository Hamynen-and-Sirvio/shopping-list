const Modal = ({ openModal, handleCloseModal, entry }) => {
  if (!openModal) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-title">
          <h3>{entry.content}</h3>
        </div>
        <p>Modal</p>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  )
}

export default Modal
