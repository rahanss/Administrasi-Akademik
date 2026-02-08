import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/halaman';
const MENU_API = '/api/cms/menu';
const KAT_API = '/api/cms/kategori';

export default function CmsHalaman() {
  const [list, setList] = useState([]);
  const [menus, setMenus] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ menu_id: '', kategori_id: '', judul: '', slug: '', konten: '', tipe_konten: 'narrative', meta_deskripsi: '', published: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const [h, m, k] = await Promise.all([axios.get(API), axios.get(MENU_API), axios.get(KAT_API)]);
      setList(h.data);
      setMenus(m.data);
      setKategori(k.data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openEdit = (r) => {
    setEditing(r);
    setForm({ menu_id: r.menu_id || '', kategori_id: r.kategori_id || '', judul: r.judul, slug: r.slug, konten: r.konten || '', tipe_konten: r.tipe_konten || 'narrative', meta_deskripsi: r.meta_deskripsi || '', published: !!r.published });
    setModal(true);
    setErr('');
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!editing) {
      setErr('Mode Edit Only: Tidak dapat menambah halaman baru. Hanya dapat mengedit halaman yang sudah ada.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const payload = { ...form, menu_id: form.menu_id || null, kategori_id: form.kategori_id || null };
      await axios.put(`${API}/${editing.id}`, payload);
      closeModal();
      fetchList();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  const hapus = async (r) => {
    if (!window.confirm(`Hapus halaman "${r.judul}"?`)) return;
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
        <h1 className="cms-page-title">Halaman Konten</h1>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic' }}>
          Mode Edit Only: Hanya dapat mengedit halaman yang sudah ada
        </div>
      </div>
      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading && <div className="cms-loading">Memuat...</div>}
          {!loading && list.length === 0 && <div className="cms-empty">Belum ada data.</div>}
          {!loading && list.length > 0 && (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Slug</th>
                  <th>Menu</th>
                  <th>Tipe</th>
                  <th>Published</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.judul}</td>
                    <td><code>{r.slug}</code></td>
                    <td>{r.menu_nama || '-'}</td>
                    <td>{r.tipe_konten || 'narrative'}</td>
                    <td><span className={`cms-badge ${r.published ? 'cms-badge-success' : 'cms-badge-warning'}`}>{r.published ? 'Ya' : 'Tidak'}</span></td>
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

      {modal && editing && (
        <div className="cms-modal-overlay" onClick={closeModal}>
          <div className="cms-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="cms-modal-header">Edit Halaman</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Judul *</label>
                  <input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Kosongkan untuk auto" />
                </div>
                <div className="cms-form-group">
                  <label>Menu</label>
                  <select value={form.menu_id} onChange={e => setForm({ ...form, menu_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {menus.map((m) => <option key={m.id} value={m.id}>{m.nama} ({m.tipe})</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Kategori</label>
                  <select value={form.kategori_id} onChange={e => setForm({ ...form, kategori_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {kategori.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Konten (HTML) *</label>
                  <textarea value={form.konten} onChange={e => setForm({ ...form, konten: e.target.value })} required style={{ minHeight: 160 }} />
                </div>
                <div className="cms-form-group">
                  <label>Tipe Konten</label>
                  <select value={form.tipe_konten} onChange={e => setForm({ ...form, tipe_konten: e.target.value })}>
                    <option value="narrative">narrative</option>
                    <option value="list">list</option>
                    <option value="table">table</option>
                    <option value="card">card</option>
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Meta Deskripsi</label>
                  <textarea value={form.meta_deskripsi} onChange={e => setForm({ ...form, meta_deskripsi: e.target.value })} rows={2} />
                </div>
                <div className="cms-form-group">
                  <label><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Published</label>
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
