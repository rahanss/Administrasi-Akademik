// Komponen untuk protect CMS routes
// Mengikuti prinsip HCI: visibility of system status dan error prevention

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import LoadingSpinner from './LoadingSpinner';
import { logError } from '../utils/errorHandler';

const API = '/api/cms/auth/me';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cms_token');
      
      // Kalau gak ada token, langsung redirect
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Verify token dengan backend
        const { data } = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.user) {
          setAuthenticated(true);
        } else {
          // Token valid tapi user tidak ditemukan
          localStorage.removeItem('cms_token');
          localStorage.removeItem('cms_user');
        }
      } catch (error) {
        // Token invalid atau expired
        logError('ProtectedRoute - checkAuth', error);
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Tampilkan loading spinner saat verify token
  if (loading) {
    return (
      <LoadingSpinner 
        message="Memverifikasi autentikasi..." 
        fullScreen 
      />
    );
  }

  // Redirect ke login kalau tidak authenticated
  if (!authenticated) {
    return <Navigate to="/cms/login" replace />;
  }

  // Render children kalau authenticated
  return children;
}
