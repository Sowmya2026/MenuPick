import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const DropdownSelector = ({ options = [], selected, onSelect, label, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => opt.id === selected)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionId) => {
    if (typeof onSelect === 'function') {
      onSelect(optionId)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative w-full mb-6" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <span>{label}</span>
        </label>
      )}
      
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-xl shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between transition-all duration-300 hover:border-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedOption?.icon && <span className="mr-3 text-gray-600">{selectedOption.icon}</span>}
          <span className="truncate font-medium">{selectedOption?.name || placeholder}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.id}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-between ${
                  selected === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
                onClick={() => handleSelect(option.id)}
              >
                <div className="flex items-center">
                  {option.icon && <span className="mr-3 text-gray-600">{option.icon}</span>}
                  <span className="font-medium">{option.name}</span>
                </div>
                
                {selected === option.id && (
                  <Check size={18} className="text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownSelector