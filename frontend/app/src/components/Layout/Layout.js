import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from '../Breadcrumb';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);

  useEffect(() => {
    // Determine if sidebar should be shown based on route
    const isHomepage = location.pathname === '/';
    setShowSidebar(!isHomepage);
    
    // Determine current module type
    if (location.pathname.startsWith('/panduan')) {
      setCurrentModule('panduan');
    } else if (!isHomepage) {
      setCurrentModule('akademik');
    } else {
      setCurrentModule(null);
    }
  }, [location.pathname]);

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        {showSidebar && (
          <Sidebar currentModule={currentModule} />
        )}
        <main className={`layout-content ${showSidebar ? 'with-sidebar' : ''}`}>
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;




