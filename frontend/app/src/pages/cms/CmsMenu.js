import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/menu';
const KAT_API = '/api/cms/kategori';

export default function CmsMenu() {
  const [list, setList] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kategori_id: '', parent_id: '', nama: '', slug: '', urutan: 0, icon: '', tipe: 'akademik' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const [m, k] = await Promise.all([axios.get(API), axios.get(KAT_API)]);
      setList(m.data);
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
    setForm({ kategori_id: r.kategori_id || '', parent_id: r.parent_id || '', nama: r.nama, slug: r.slug, urutan: r.urutan || 0, icon: r.icon || '', tipe: r.tipe || 'akademik' });
    setModal(true);
    setErr('');
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (!editing) {
      setErr('Mode Edit Only: Tidak dapat menambah menu baru. Hanya dapat mengedit menu yang sudah ada.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const payload = { ...form, kategori_id: form.kategori_id || null, parent_id: form.parent_id || null };
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
    if (!window.confirm(`Hapus menu "${r.nama}"?`)) return;
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
        <h1 className="cms-page-title">Menu Sidebar</h1>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontStyle: 'italic' }}>
          Mode Edit Only: Hanya dapat mengedit menu yang sudah ada
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
                  <th>Urutan</th>
                  <th>Nama</th>
                  <th>Slug</th>
                  <th>Tipe</th>
                  <th>Kategori</th>
                  <th>Parent</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.urutan}</td>
                    <td>{r.nama}</td>
                    <td><code>{r.slug}</code></td>
                    <td>{r.tipe}</td>
                    <td>{r.kategori_nama || '-'}</td>
                    <td>{r.parent_id ? `#${r.parent_id}` : '-'}</td>
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
          <div className="cms-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="cms-modal-header">Edit Menu</div>
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
                  <label>Tipe</label>
                  <select value={form.tipe} onChange={e => setForm({ ...form, tipe: e.target.value })}>
                    <option value="akademik">akademik</option>
                    <option value="panduan">panduan</option>
                    <option value="layanan">layanan</option>
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
                  <label>Parent (ID)</label>
                  <select value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">-- Tidak ada --</option>
                    {list.filter(m => !m.parent_id).map((m) => <option key={m.id} value={m.id}>{m.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Urutan</label>
                  <input type="number" value={form.urutan} onChange={e => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="cms-form-group">
                  <label>Icon</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
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
