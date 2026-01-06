import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../Loading';
import './Sidebar.css';

const Sidebar = ({ currentModule }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`/api/menu/${currentModule}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentModule) {
      fetchMenuItems();
    }
  }, [currentModule]);

  const handleMenuClick = (slug) => {
    navigate(`/${slug}`);
  };

  const getMenuIcon = (iconName) => {
    const icons = {
      calendar: '📅',
      book: '📚',
      users: '👥',
      coordinate: '📍',
      mentor: '👨‍🏫',
      schedule: '⏰',
      exam: '📝',
      conflict: '⚠️',
      form: '📋',
      register: '📝',
      academic: '🎓',
      admin: '📄'
    };
    return icons[iconName] || '📄';
  };

  if (loading) {
    return (
      <aside className="sidebar">
        <Loading message="Memuat menu..." />
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/${item.slug}` || 
                          location.pathname.startsWith(`/${item.slug}/`);
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.slug)}
            >
              <span className="sidebar-icon">{getMenuIcon(item.icon)}</span>
              <span className="sidebar-text">{item.nama}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


