import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const API = '/api/cms/auth/me';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.user) {
          setAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/cms/login" replace />;
  }

  return children;
}
