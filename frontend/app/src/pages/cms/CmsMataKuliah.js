import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/mata-kuliah';
const PRODI_API = '/api/cms/prodi';

export default function CmsMataKuliah() {
  const [list, setList] = useState([]);
  const [prodi, setProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ prodi_id: '', kode: '', nama: '', sks: 3, semester: 1, deskripsi: '', prasyarat: '', aktif: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const [mk, p] = await Promise.all([axios.get(API), axios.get(PRODI_API)]);
      setList(mk.data);
      setProdi(p.data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ prodi_id: '', kode: '', nama: '', sks: 3, semester: 1, deskripsi: '', prasyarat: '', aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ prodi_id: r.prodi_id, kode: r.kode, nama: r.nama, sks: r.sks || 3, semester: r.semester || 1, deskripsi: r.deskripsi || '', prasyarat: r.prasyarat || '', aktif: r.aktif !== 0 });
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
    if (!window.confirm(`Hapus mata kuliah "${r.nama}"?`)) return;
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
        <h1 className="cms-page-title">Mata Kuliah</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Mata Kuliah</button>
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
                  <th>Prodi</th>
                  <th>SKS</th>
                  <th>Semester</th>
                  <th>Aktif</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.kode}</strong></td>
                    <td>{r.nama}</td>
                    <td>{r.prodi_kode} - {r.prodi_nama}</td>
                    <td>{r.sks}</td>
                    <td>{r.semester}</td>
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
          <div className="cms-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="cms-modal-header">{editing ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Prodi *</label>
                  <select value={form.prodi_id} onChange={e => setForm({ ...form, prodi_id: e.target.value })} required>
                    <option value="">-- Pilih --</option>
                    {prodi.map((p) => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Kode *</label>
                  <input value={form.kode} onChange={e => setForm({ ...form, kode: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Nama *</label>
                  <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>SKS *</label>
                  <input type="number" min={1} value={form.sks} onChange={e => setForm({ ...form, sks: parseInt(e.target.value) || 0 })} required />
                </div>
                <div className="cms-form-group">
                  <label>Semester *</label>
                  <input type="number" min={1} value={form.semester} onChange={e => setForm({ ...form, semester: parseInt(e.target.value) || 1 })} required />
                </div>
                <div className="cms-form-group">
                  <label>Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Prasyarat</label>
                  <input value={form.prasyarat} onChange={e => setForm({ ...form, prasyarat: e.target.value })} />
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
