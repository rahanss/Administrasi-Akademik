import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/cms/layanan';

export default function CmsLayanan() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nama: '', slug: '', deskripsi: '', lokasi: '', telepon: '', email: '', jam_operasional: '', icon: '', urutan: 0, aktif: true });
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
    setForm({ nama: '', slug: '', deskripsi: '', lokasi: '', telepon: '', email: '', jam_operasional: '', icon: '', urutan: 0, aktif: true });
    setModal(true);
    setErr('');
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({ nama: r.nama, slug: r.slug, deskripsi: r.deskripsi || '', lokasi: r.lokasi || '', telepon: r.telepon || '', email: r.email || '', jam_operasional: r.jam_operasional || '', icon: r.icon || '', urutan: r.urutan || 0, aktif: r.aktif !== 0 });
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
    if (!window.confirm(`Hapus layanan "${r.nama}"?`)) return;
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
        <h1 className="cms-page-title">Layanan</h1>
        <button type="button" className="cms-btn cms-btn-primary" onClick={openCreate}>Tambah Layanan</button>
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
                  <th>Lokasi</th>
                  <th>Jam Operasional</th>
                  <th>Aktif</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>{r.urutan}</td>
                    <td>{r.nama}</td>
                    <td>{r.lokasi}</td>
                    <td>{(r.jam_operasional || '').slice(0, 30)}</td>
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
            <div className="cms-modal-header">{editing ? 'Edit Layanan' : 'Tambah Layanan'}</div>
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
                  <label>Deskripsi *</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Lokasi *</label>
                  <input value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} required />
                </div>
                <div className="cms-form-group">
                  <label>Telepon</label>
                  <input value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="cms-form-group">
                  <label>Jam Operasional *</label>
                  <input value={form.jam_operasional} onChange={e => setForm({ ...form, jam_operasional: e.target.value })} required placeholder="Contoh: Senin-Jumat 08:00-16:00" />
                </div>
                <div className="cms-form-group">
                  <label>Icon (nama)</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="academic, library, dll" />
                </div>
                <div className="cms-form-group">
                  <label>Urutan</label>
                  <input type="number" value={form.urutan} onChange={e => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} />
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
