import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  // Close sidebar when clicking on the main content area
  const handleLayoutClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex overflow-hidden bg-gray-100" onClick={handleLayoutClick}>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6" onClick={(e) => e.stopPropagation()}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;