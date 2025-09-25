import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const DropdownSelector = ({ options = [], selected, onSelect, label, placeholder = "Select an option", messType = 'veg' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => opt.id === selected)

  // Get focus color based on mess type
  const getFocusColor = () => {
    switch (messType) {
      case 'veg':
        return 'focus:ring-green-500 focus:border-green-500';
      case 'non-veg':
        return 'focus:ring-red-500 focus:border-red-500';
      case 'special':
        return 'focus:ring-purple-500 focus:border-purple-500';
      default:
        return 'focus:ring-blue-500 focus:border-blue-500';
    }
  };

  // Get selected color based on mess type
  const getSelectedColor = () => {
    switch (messType) {
      case 'veg':
        return 'bg-green-50 text-green-700';
      case 'non-veg':
        return 'bg-red-50 text-red-700';
      case 'special':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  // Get hover color based on mess type
  const getHoverColor = () => {
    switch (messType) {
      case 'veg':
        return 'hover:bg-green-50';
      case 'non-veg':
        return 'hover:bg-red-50';
      case 'special':
        return 'hover:bg-purple-50';
      default:
        return 'hover:bg-blue-50';
    }
  };

  // Get check color based on mess type
  const getCheckColor = () => {
    switch (messType) {
      case 'veg':
        return 'text-green-600';
      case 'non-veg':
        return 'text-red-600';
      case 'special':
        return 'text-purple-600';
      default:
        return 'text-blue-600';
    }
  };

  const focusColor = getFocusColor();
  const selectedColor = getSelectedColor();
  const hoverColor = getHoverColor();
  const checkColor = getCheckColor();

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
        className={`w-full bg-white border border-gray-300 rounded-xl shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 ${focusColor} flex items-center justify-between transition-all duration-300 hover:border-gray-400`}
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
                className={`w-full text-left px-4 py-3 ${hoverColor} transition-colors duration-300 flex items-center justify-between ${
                  selected === option.id ? `${selectedColor}` : 'text-gray-700'
                }`}
                onClick={() => handleSelect(option.id)}
              >
                <div className="flex items-center">
                  {option.icon && <span className="mr-3 text-gray-600">{option.icon}</span>}
                  <span className="font-medium">{option.name}</span>
                </div>
                
                {selected === option.id && (
                  <Check size={18} className={`${checkColor} flex-shrink-0`} />
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