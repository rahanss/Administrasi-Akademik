import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/kategori';

export default function CmsKategori() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nama: '', slug: '', deskripsi: '', icon: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API);
      setList(data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nama: '', slug: '', deskripsi: '', icon: '' });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ nama: r.nama, slug: r.slug, deskripsi: r.deskripsi || '', icon: r.icon || '' });
    setModal(true);
    setErr('');
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      if (editing) await axios.put(`${API}/${editing.id}`, form);
      else await axios.post(API, form);
      closeModal();
      fetchList();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  const hapus = async (r) => {
    if (!window.confirm(`Hapus kategori "${r.nama}"?`)) return;
    try {
      await axios.delete(`${API}/${r.id}`);
      fetchList();
    } catch (e) {
      alert(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <div className="cms-page-header">
        <h1 className="cms-page-title">Kategori Konten</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Kategori</button>
      </div>
      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading && <div className="cms-loading">Memuat...</div>}
          {!loading && list.length === 0 && <div className="cms-empty">Belum ada data.</div>}
          {!loading && list.length > 0 && (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Slug</th>
                  <th>Deskripsi</th>
                  <th>Icon</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nama}</td>
                    <td><code>{r.slug}</code></td>
                    <td>{(r.deskripsi || '').slice(0, 40)}</td>
                    <td>{r.icon || '-'}</td>
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
          <div className="cms-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="cms-modal-header">{editing ? 'Edit Kategori' : 'Tambah Kategori'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Nama *</label>
                  <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Kosongkan untuk auto" />
                </div>
                <div className="cms-form-group">
                  <label>Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Icon</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="academic, guide, dll" />
                </div>
              </div>
              <div className="cms-modal-footer">
                <button type="button" className="cms-btn cms-btn-secondary" onClick={closeModal}>Batal</button>
                <button type="submit" className="cms-btn cms-btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
