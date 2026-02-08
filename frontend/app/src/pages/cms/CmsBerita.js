import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { getErrorMessage, logError } from '../../utils/errorHandler';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { API_ENDPOINTS, SUCCESS_MESSAGES } from '../../utils/constants';

const API = API_ENDPOINTS.CMS_BERITA;

export default function CmsBerita() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ judul: '', slug: '', ringkasan: '', konten: '', gambar: '', published: true, featured: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchList = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(API);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      logError('CmsBerita - fetchList', e);
      const errorMessage = getErrorMessage(e);
      setError(errorMessage);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ judul: '', slug: '', ringkasan: '', konten: '', gambar: '', published: true, featured: false });
    setModal(true);
    setError('');
    setSuccess('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ 
      judul: r.judul || '', 
      slug: r.slug || '', 
      ringkasan: r.ringkasan || '', 
      konten: r.konten || '', 
      gambar: r.gambar || '', 
      published: !!r.published, 
      featured: !!r.featured 
    });
    setModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => { 
    setModal(false); 
    setEditing(null);
    setError('');
    setSuccess('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (editing) {
        await axios.put(`${API}/${editing.id}`, form);
        setSuccess(SUCCESS_MESSAGES.UPDATED);
      } else {
        await axios.post(API, form);
        setSuccess(SUCCESS_MESSAGES.CREATED);
      }
      
      // Close modal dan refresh list setelah delay singkat (untuk user lihat success message)
      setTimeout(() => {
        closeModal();
        fetchList();
      }, 1000);
    } catch (e) {
      logError('CmsBerita - submit', e);
      const errorMessage = getErrorMessage(e);
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const hapus = async (r) => {
    if (!window.confirm(`Hapus berita "${r.judul}"?`)) return;
    
    try {
      await axios.delete(`${API}/${r.id}`);
      setSuccess(SUCCESS_MESSAGES.DELETED);
      fetchList();
      
      // Auto hide success message setelah 3 detik
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      logError('CmsBerita - hapus', e);
      const errorMessage = getErrorMessage(e);
      setError(errorMessage);
    }
  };

  return (
    <>
      <div className="cms-page-header">
        <h1 className="cms-page-title">Berita</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Berita</button>
      </div>
      {error && (
        <ErrorMessage 
          message={error} 
          dismissible 
          onDismiss={() => setError('')} 
        />
      )}
      
      {success && (
        <SuccessMessage 
          message={success} 
          dismissible 
          onDismiss={() => setSuccess('')}
          autoHide={3}
        />
      )}

      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading ? (
            <LoadingSpinner message="Memuat data berita..." />
          ) : error && list.length === 0 ? (
            <div className="cms-empty">
              <p>{error}</p>
              <button 
                type="button" 
                className="cms-btn cms-btn-secondary cms-btn-sm" 
                onClick={fetchList}
              >
                Coba lagi
              </button>
            </div>
          ) : list.length === 0 ? (
            <div className="cms-empty">Belum ada data.</div>
          ) : (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Slug</th>
                  <th>Published</th>
                  <th>Featured</th>
                  <th>Tgl</th>
                  <th style={{ width: 140 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.judul}</td>
                    <td><code>{r.slug}</code></td>
                    <td><span className={`cms-badge ${r.published ? 'cms-badge-success' : 'cms-badge-warning'}`}>{r.published ? 'Ya' : 'Tidak'}</span></td>
                    <td>{r.featured ? 'Ya' : '-'}</td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    <td>
                      <div className="cms-actions">
                        <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => openEdit(r)}>Edit</button>
                        <button type="button" className="cms-btn cms-btn-danger cms-btn-sm" onClick={() => hapus(r)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="cms-modal-overlay" onClick={closeModal}>
          <div className="cms-modal" onClick={e => e.stopPropagation()}>
            <div className="cms-modal-header">{editing ? 'Edit Berita' : 'Tambah Berita'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {error && (
                  <ErrorMessage message={error} dismissible onDismiss={() => setError('')} />
                )}
                {success && (
                  <SuccessMessage message={success} dismissible onDismiss={() => setSuccess('')} autoHide={2} />
                )}
                <div className="cms-form-group">
                  <label>Judul *</label>
                  <input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Kosongkan untuk auto dari judul" />
                </div>
                <div className="cms-form-group">
                  <label>Ringkasan</label>
                  <textarea value={form.ringkasan} onChange={e => setForm({ ...form, ringkasan: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Konten (HTML) *</label>
                  <textarea value={form.konten} onChange={e => setForm({ ...form, konten: e.target.value })} required style={{ minHeight: 180 }} />
                </div>
                <div className="cms-form-group">
                  <label>URL Gambar</label>
                  <input value={form.gambar} onChange={e => setForm({ ...form, gambar: e.target.value })} placeholder="https://..." />
                </div>
                <div className="cms-form-group">
                  <label><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Published</label>
                </div>
                <div className="cms-form-group">
                  <label><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                </div>
              </div>
              <div className="cms-modal-footer">
                <button 
                  type="button" 
                  className="cms-btn cms-btn-secondary" 
                  onClick={closeModal}
                  disabled={saving}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="cms-btn cms-btn-primary" 
                  disabled={saving}
                  aria-busy={saving}
                >
                  {saving ? (
                    <>
                      <LoadingSpinner size="small" message="" />
                      <span style={{ marginLeft: '0.5rem' }}>Menyimpan...</span>
                    </>
                  ) : (
                    editing ? 'Update' : 'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
