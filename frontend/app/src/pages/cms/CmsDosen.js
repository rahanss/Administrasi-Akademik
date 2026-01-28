import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/dosen';
const PRODI_API = '/api/cms/prodi';

export default function CmsDosen() {
  const [list, setList] = useState([]);
  const [prodi, setProdi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nip: '', nama: '', gelar_depan: '', gelar_belakang: '', prodi_id: '', email: '', telepon: '', jabatan: '', aktif: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    setErr('');
    try {
      const [d, p] = await Promise.all([axios.get(API), axios.get(PRODI_API)]);
      setList(Array.isArray(d.data) ? d.data : []);
      setProdi(Array.isArray(p.data) ? p.data : []);
    } catch (e) {
      setErr(e.response?.data?.error || e.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nip: '', nama: '', gelar_depan: '', gelar_belakang: '', prodi_id: '', email: '', telepon: '', jabatan: '', aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ nip: r.nip, nama: r.nama, gelar_depan: r.gelar_depan || '', gelar_belakang: r.gelar_belakang || '', prodi_id: r.prodi_id || '', email: r.email || '', telepon: r.telepon || '', jabatan: r.jabatan || '', aktif: r.aktif !== 0 });
    setModal(true);
    setErr('');
  };

  const closeModal = () => { setModal(false); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const payload = { ...form, prodi_id: form.prodi_id || null };
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
    if (!window.confirm(`Hapus dosen "${r.nama}"?`)) return;
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
        <h1 className="cms-page-title">Dosen</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Dosen</button>
      </div>
      <div className="cms-card">
        <div className="cms-table-wrap">
          {loading && <div className="cms-loading">Memuat...</div>}
          {!loading && err && <div className="cms-empty" style={{ color: '#dc2626' }}>{err}<br /><button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 8 }} onClick={fetchList}>Coba lagi</button></div>}
          {!loading && !err && list.length === 0 && <div className="cms-empty">Belum ada data.</div>}
          {!loading && !err && list.length > 0 && (
            <table className="cms-table">
              <thead>
                <tr>
                  <th>NIP</th>
                  <th>Nama</th>
                  <th>Prodi</th>
                  <th>Email</th>
                  <th>Jabatan</th>
                  <th>Aktif</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nip}</td>
                    <td>{(r.gelar_depan || '') + ' ' + r.nama + (r.gelar_belakang ? ', ' + r.gelar_belakang : '')}</td>
                    <td>{r.prodi_nama || '-'}</td>
                    <td>{r.email || '-'}</td>
                    <td>{r.jabatan || '-'}</td>
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
            <div className="cms-modal-header">{editing ? 'Edit Dosen' : 'Tambah Dosen'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>NIP *</label>
                  <input value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Nama *</label>
                  <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Gelar Depan</label>
                  <input value={form.gelar_depan} onChange={e => setForm({ ...form, gelar_depan: e.target.value })} placeholder="Dr., Prof." />
                </div>
                <div className="cms-form-group">
                  <label>Gelar Belakang</label>
                  <input value={form.gelar_belakang} onChange={e => setForm({ ...form, gelar_belakang: e.target.value })} placeholder="M.Kom, S.T" />
                </div>
                <div className="cms-form-group">
                  <label>Prodi</label>
                  <select value={form.prodi_id} onChange={e => setForm({ ...form, prodi_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {prodi.map((p) => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Telepon</label>
                  <input value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Jabatan</label>
                  <input value={form.jabatan} onChange={e => setForm({ ...form, jabatan: e.target.value })} />
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
