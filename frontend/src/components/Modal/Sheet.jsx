import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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

    // Keep the sheet inside the visible area when the on-screen keyboard is open
    const fitToViewport = () => {
      overlay.style.setProperty('--visible-height', `${viewport.height}px`)
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

  // Render at the body level so no parent stacking context can cover the sheet
  return createPortal(
    <div className="sheet-overlay" ref={overlayRef} onClick={handleCloseModal}>
      <div
        className={`sheet ${className}`}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Sheet
