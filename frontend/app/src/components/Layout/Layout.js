import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from '../Breadcrumb';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);

  useEffect(() => {
    // Determine if sidebar should be shown based on route
    const isHomepage = location.pathname === '/';
    const isInformasiLayanan = location.pathname === '/informasi-layanan';
    const isBerita = location.pathname === '/berita' || location.pathname.startsWith('/berita/');
    
    // Hide sidebar for homepage, informasi layanan, and berita pages
    setShowSidebar(!isHomepage && !isInformasiLayanan && !isBerita);
    
    // Determine current module type
    if (location.pathname.startsWith('/panduan')) {
      setCurrentModule('panduan');
    } else if (isInformasiLayanan) {
      setCurrentModule('layanan');
    } else if (!isHomepage && !isBerita) {
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;




