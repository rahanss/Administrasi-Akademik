import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import './CmsLogin.css';

const API = '/api/cms/auth/login';

export default function CmsLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const usernameInputRef = useRef(null);

  // Focus ke username input saat component mount (accessibility)
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasi client-side
    if (!username.trim()) {
      setError('Username harus diisi');
      usernameInputRef.current?.focus();
      return;
    }
    
    if (!password) {
      setError('Password harus diisi');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.post(API, { 
        username: username.trim(), 
        password 
      });
      
      // Simpan token dan user info
      localStorage.setItem('cms_token', data.token);
      localStorage.setItem('cms_user', JSON.stringify(data.user));
      
      // Redirect ke dashboard
      navigate('/cms/berita', { replace: true });
    } catch (e) {
      logError('CmsLogin - handleSubmit', e);
      const errorMessage = getErrorMessage(e);
      setError(errorMessage);
      // Focus kembali ke username input setelah error
      usernameInputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cms-login-page">
      <div className="cms-login-container">
        <button 
          onClick={() => navigate('/')} 
          className="cms-login-back-btn"
          type="button"
        >
          ← Kembali ke Homepage
        </button>
        <div className="cms-login-header">
          <h1>CMS Login</h1>
          <p>Content Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="cms-login-form" noValidate>
          {error && (
            <ErrorMessage 
              message={error} 
              dismissible 
              onDismiss={() => setError('')} 
            />
          )}
          <div className="cms-login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
              autoComplete="username"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              ref={usernameInputRef}
            />
          </div>
          <div className="cms-login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
            />
          </div>
          <button 
            type="submit" 
            className="cms-login-btn" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" message="" />
                <span style={{ marginLeft: '0.5rem' }}>Memproses...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="cms-login-footer">
          <p>Untuk menambahkan user baru, hubungi administrator atau tambahkan langsung ke database.</p>
          <a href="/" className="cms-login-footer-link">
            ← Kembali ke Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
