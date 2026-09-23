import { useEffect, useRef } from 'react'
import './Sheet.css'

const Sheet = ({ handleCloseModal, className = '', children }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const viewport = window.visualViewport
    const root = document.documentElement
    const previousOverflow = root.style.overflow

    // Lock background scrolling while the sheet is open
    root.style.overflow = 'hidden'

    // Keep the overlay inside the visible area when the on-screen keyboard is open
    const fitToViewport = () => {
      overlay.style.height = `${viewport.height}px`
      overlay.style.transform = `translateY(${viewport.offsetTop}px)`
    }

    if (viewport) {
      fitToViewport()
      viewport.addEventListener('resize', fitToViewport)
      viewport.addEventListener('scroll', fitToViewport)
    }

    return () => {
      root.style.overflow = previousOverflow
      if (viewport) {
        viewport.removeEventListener('resize', fitToViewport)
        viewport.removeEventListener('scroll', fitToViewport)
      }
    }
  }, [])

  return (
    <div className="sheet-overlay" ref={overlayRef} onClick={handleCloseModal}>
      <div
        className={`sheet ${className}`}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Sheet
