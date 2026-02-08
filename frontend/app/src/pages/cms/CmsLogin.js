import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CmsLogin.css';

const API = '/api/cms/auth/login';

export default function CmsLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(API, { username, password });
      localStorage.setItem('cms_token', data.token);
      localStorage.setItem('cms_user', JSON.stringify(data.user));
      navigate('/cms/berita');
    } catch (e) {
      setError(e.response?.data?.error || 'Login gagal');
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
        <form onSubmit={handleSubmit} className="cms-login-form">
          {error && <div className="cms-login-error">{error}</div>}
          <div className="cms-login-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="cms-login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="cms-login-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
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
