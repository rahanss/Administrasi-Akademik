import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/prodi';

export default function CmsProdi() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kode: '', nama: '', jenjang: 'S1', deskripsi: '', aktif: true });
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
    setForm({ kode: '', nama: '', jenjang: 'S1', deskripsi: '', aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ kode: r.kode, nama: r.nama, jenjang: r.jenjang || 'S1', deskripsi: r.deskripsi || '', aktif: r.aktif !== 0 });
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
    if (!window.confirm(`Hapus prodi "${r.nama}"?`)) return;
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
        <h1 className="cms-page-title">Program Studi</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Prodi</button>
      </div>
      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading && <div className="cms-loading">Memuat...</div>}
          {!loading && list.length === 0 && <div className="cms-empty">Belum ada data.</div>}
          {!loading && list.length > 0 && (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Jenjang</th>
                  <th>Deskripsi</th>
                  <th>Aktif</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.kode}</strong></td>
                    <td>{r.nama}</td>
                    <td>{r.jenjang}</td>
                    <td>{(r.deskripsi || '').slice(0, 50)}{(r.deskripsi || '').length > 50 ? '...' : ''}</td>
                    <td><span className={`cms-badge ${r.aktif ? 'cms-badge-success' : 'cms-badge-warning'}`}>{r.aktif ? 'Ya' : 'Tidak'}</span></td>
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
            <div className="cms-modal-header">{editing ? 'Edit Prodi' : 'Tambah Prodi'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Kode *</label>
                  <input value={form.kode} onChange={e => setForm({ ...form, kode: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Nama *</label>
                  <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Jenjang</label>
                  <select value={form.jenjang} onChange={e => setForm({ ...form, jenjang: e.target.value })}>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label><input type="checkbox" checked={form.aktif} onChange={e => setForm({ ...form, aktif: e.target.checked })} /> Aktif</label>
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
