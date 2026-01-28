import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/koordinator';

export default function CmsKoordinator() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ mata_kuliah: '', kelas: '', dosen_id: '', dosen_nama: '', semester: 'Ganjil', tahun_akademik: '', aktif: true });
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
    setForm({ mata_kuliah: '', kelas: '', dosen_id: '', dosen_nama: '', semester: 'Ganjil', tahun_akademik: '', aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ mata_kuliah: r.mata_kuliah, kelas: r.kelas, dosen_id: r.dosen_id || '', dosen_nama: r.dosen_nama, semester: r.semester || 'Ganjil', tahun_akademik: r.tahun_akademik || '', aktif: r.aktif !== 0 });
    setModal(true);
    setErr('');
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const payload = { ...form, dosen_id: form.dosen_id || null };
      if (editing) await axios.put(`${API}/${editing.id}`, payload);
      else await axios.post(API, payload);
      closeModal();
      fetchList();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  const hapus = async (r) => {
    if (!window.confirm(`Hapus koordinator ${r.mata_kuliah} - ${r.kelas}?`)) return;
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
        <h1 className="cms-page-title">Koordinator Mata Kuliah</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah</button>
      </div>
      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading && <div className="cms-loading">Memuat...</div>}
          {!loading && list.length === 0 && <div className="cms-empty">Belum ada data.</div>}
          {!loading && list.length > 0 && (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>Mata Kuliah</th>
                  <th>Kelas</th>
                  <th>Dosen</th>
                  <th>Semester</th>
                  <th>Tahun</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.mata_kuliah}</td>
                    <td>{r.kelas}</td>
                    <td>{r.dosen_nama}</td>
                    <td>{r.semester}</td>
                    <td>{r.tahun_akademik}</td>
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
            <div className="cms-modal-header">{editing ? 'Edit Koordinator' : 'Tambah Koordinator'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Mata Kuliah *</label>
                  <input value={form.mata_kuliah} onChange={e => setForm({ ...form, mata_kuliah: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Kelas *</label>
                  <input value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} required placeholder="3IA26" />
                </div>
                <div className="cms-form-group">
                  <label>Nama Dosen *</label>
                  <input value={form.dosen_nama} onChange={e => setForm({ ...form, dosen_nama: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Semester</label>
                  <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Tahun Akademik *</label>
                  <input value={form.tahun_akademik} onChange={e => setForm({ ...form, tahun_akademik: e.target.value })} required placeholder="2025/2026" />
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
