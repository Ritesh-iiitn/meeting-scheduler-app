import * as React from "react"

// A generic Modal structure template if needed. (Usage is handled mostly in EventTypeModal directly)
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
       <div className="relative bg-white rounded-lg shadow-lg z-10">
          {children}
       </div>
    </div>
  )
}
