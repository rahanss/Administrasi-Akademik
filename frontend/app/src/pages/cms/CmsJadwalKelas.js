import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/jadwal-kelas';

export default function CmsJadwalKelas() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kelas: '', hari: 'Senin', mata_kuliah: '', waktu: '', ruang: '', dosen: '', semester: '', tahun_akademik: '', aktif: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const fetchList = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await axios.get(API);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.response?.data?.error || e.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ kelas: '', hari: 'Senin', mata_kuliah: '', waktu: '', ruang: '', dosen: '', semester: '', tahun_akademik: '', aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ kelas: r.kelas, hari: r.hari || 'Senin', mata_kuliah: r.mata_kuliah, waktu: r.waktu, ruang: r.ruang, dosen: r.dosen, semester: r.semester || '', tahun_akademik: r.tahun_akademik || '', aktif: r.aktif !== 0 });
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
    if (!window.confirm(`Hapus jadwal ${r.kelas} - ${r.mata_kuliah}?`)) return;
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
        <h1 className="cms-page-title">Jadwal Kelas</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah</button>
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
                  <th>Kelas</th>
                  <th>Hari</th>
                  <th>Mata Kuliah</th>
                  <th>Waktu</th>
                  <th>Ruang</th>
                  <th>Dosen</th>
                  <th>Sem/Tahun</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.kelas}</td>
                    <td>{r.hari}</td>
                    <td>{r.mata_kuliah}</td>
                    <td>{r.waktu}</td>
                    <td>{r.ruang}</td>
                    <td>{r.dosen}</td>
                    <td>{r.semester} {r.tahun_akademik}</td>
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
            <div className="cms-modal-header">{editing ? 'Edit Jadwal Kelas' : 'Tambah Jadwal Kelas'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Kelas *</label>
                  <input value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })} required placeholder="3IA26" />
                </div>
                <div className="cms-form-group">
                  <label>Hari *</label>
                  <select value={form.hari} onChange={e => setForm({ ...form, hari: e.target.value })}>
                    {HARI.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Mata Kuliah *</label>
                  <input value={form.mata_kuliah} onChange={e => setForm({ ...form, mata_kuliah: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Waktu *</label>
                  <input value={form.waktu} onChange={e => setForm({ ...form, waktu: e.target.value })} required placeholder="2/3/4 atau 08:00-10:00" />
                </div>
                <div className="cms-form-group">
                  <label>Ruang *</label>
                  <input value={form.ruang} onChange={e => setForm({ ...form, ruang: e.target.value })} required placeholder="E341" />
                </div>
                <div className="cms-form-group">
                  <label>Dosen *</label>
                  <input value={form.dosen} onChange={e => setForm({ ...form, dosen: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Semester</label>
                  <input value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} placeholder="Ganjil" />
                </div>
                <div className="cms-form-group">
                  <label>Tahun Akademik</label>
                  <input value={form.tahun_akademik} onChange={e => setForm({ ...form, tahun_akademik: e.target.value })} placeholder="2025/2026" />
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
