// components/DevTestButton.js
import { useState } from 'react';
import { TestTube } from 'lucide-react';

const DevTestButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after triple click
  const handleTripleClick = () => {
    setIsVisible(prev => !prev);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <>
      {/* Hidden trigger area */}
      <div 
        className="fixed bottom-4 left-4 w-10 h-10 opacity-0 cursor-pointer z-50"
        onClick={handleTripleClick}
      />
      
      {/* Test button */}
      {isVisible && (
        <a
          href="/test-notifications"
          className="fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          title="Test Notifications"
        >
          <TestTube size={20} />
        </a>
      )}
    </>
  );
};

export default DevTestButton;