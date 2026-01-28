import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/jadwal-ujian';
const MK_API = '/api/cms/mata-kuliah';
const DOSEN_API = '/api/cms/dosen';

export default function CmsJadwalUjian() {
  const [list, setList] = useState([]);
  const [mk, setMk] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ mata_kuliah_id: '', dosen_id: '', jenis_ujian: 'UTS', tanggal: '', jam_mulai: '08:00', jam_selesai: '10:00', ruang: '', kampus: 'D', semester: '', tahun_akademik: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const fetchList = async () => {
    setLoading(true);
    try {
      const [j, m, d] = await Promise.all([axios.get(API), axios.get(MK_API), axios.get(DOSEN_API)]);
      setList(j.data);
      setMk(m.data);
      setDosen(d.data);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ mata_kuliah_id: '', dosen_id: '', jenis_ujian: 'UTS', tanggal: '', jam_mulai: '08:00', jam_selesai: '10:00', ruang: '', kampus: 'D', semester: '', tahun_akademik: '' });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    const d = r.tanggal ? r.tanggal.slice(0, 10) : '';
    setForm({ mata_kuliah_id: r.mata_kuliah_id, dosen_id: r.dosen_id || '', jenis_ujian: r.jenis_ujian || 'UTS', tanggal: d, jam_mulai: (r.jam_mulai || '').slice(0, 5), jam_selesai: (r.jam_selesai || '').slice(0, 5), ruang: r.ruang || '', kampus: r.kampus || 'D', semester: r.semester || '', tahun_akademik: r.tahun_akademik || '' });
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
    if (!window.confirm('Hapus jadwal ujian ini?')) return;
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
        <h1 className="cms-page-title">Jadwal Ujian</h1>
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
                  <th>Jenis</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Ruang</th>
                  <th>Kampus</th>
                  <th>Dosen</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.mata_kuliah_kode} - {r.mata_kuliah_nama}</td>
                    <td>{r.jenis_ujian}</td>
                    <td>{r.tanggal ? new Date(r.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                    <td>{(r.jam_mulai || '').slice(0, 5)} - {(r.jam_selesai || '').slice(0, 5)}</td>
                    <td>{r.ruang}</td>
                    <td>{r.kampus}</td>
                    <td>{r.dosen_nama || '-'}</td>
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
            <div className="cms-modal-header">{editing ? 'Edit Jadwal Ujian' : 'Tambah Jadwal Ujian'}</div>
            <form onSubmit={submit}>
              <div className="cms-modal-body">
                {err && <div style={{ color: '#dc2626', padding: '0 0 0.75rem', fontSize: '0.9rem' }}>{err}</div>}
                <div className="cms-form-group">
                  <label>Mata Kuliah *</label>
                  <select value={form.mata_kuliah_id} onChange={e => setForm({ ...form, mata_kuliah_id: e.target.value })} required>
                    <option value="">-- Pilih --</option>
                    {mk.map((m) => <option key={m.id} value={m.id}>{m.kode} - {m.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Dosen</label>
                  <select value={form.dosen_id} onChange={e => setForm({ ...form, dosen_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {dosen.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Jenis Ujian *</label>
                  <select value={form.jenis_ujian} onChange={e => setForm({ ...form, jenis_ujian: e.target.value })}>
                    <option value="UTS">UTS</option>
                    <option value="UAS">UAS</option>
                    <option value="UTS-UAS">UTS-UAS</option>
                  </select>
                </div>
                <div className="cms-form-group">
                  <label>Tanggal *</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Jam Mulai *</label>
                  <input type="time" value={form.jam_mulai} onChange={e => setForm({ ...form, jam_mulai: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Jam Selesai *</label>
                  <input type="time" value={form.jam_selesai} onChange={e => setForm({ ...form, jam_selesai: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Ruang *</label>
                  <input value={form.ruang} onChange={e => setForm({ ...form, ruang: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Kampus</label>
                  <input value={form.kampus} onChange={e => setForm({ ...form, kampus: e.target.value })} placeholder="D, E, C, G" />
                </div>
                <div className="cms-form-group">
                  <label>Semester *</label>
                  <input value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required placeholder="Ganjil" />
                </div>
                <div className="cms-form-group">
                  <label>Tahun Akademik *</label>
                  <input value={form.tahun_akademik} onChange={e => setForm({ ...form, tahun_akademik: e.target.value })} required placeholder="2025/2026" />
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
