'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

const EMPTY_FORM = {
  name: '', title_tr: '', title_en: '', specialty_tr: '', specialty_en: '',
  bio_tr: '', bio_en: '', display_order: 0, is_active: true, photo_url: ''
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchMembers = () => {
    supabase.from('team_members').select('*').order('display_order')
      .then(({ data }) => setMembers(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `team/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { toast.error('Fotoğraf yüklenemedi.'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm(f => ({ ...f, photo_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    let error;
    if (editing) {
      ({ error } = await supabase.from('team_members').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('team_members').insert(payload));
    }
    if (error) { toast.error('Hata: ' + error.message); return; }
    toast.success(editing ? 'Güncellendi!' : 'Eklendi!');
    setForm(EMPTY_FORM); setEditing(null); setShowForm(false);
    fetchMembers();
  };

  const handleEdit = (m) => {
    setForm({ ...m }); setEditing(m.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    toast.success('Silindi.');
    fetchMembers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">Ekip Yönetimi</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-heading font-bold text-xl mb-6">{editing ? 'Düzenle' : 'Yeni Ekip Üyesi'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="form-label">Ad Soyad *</label>
              <input required className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Ünvan (TR)</label>
              <input className="form-input" value={form.title_tr} onChange={e => setForm(f => ({ ...f, title_tr: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Ünvan (EN)</label>
              <input className="form-input" value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Uzmanlık (TR)</label>
              <input className="form-input" value={form.specialty_tr} onChange={e => setForm(f => ({ ...f, specialty_tr: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Uzmanlık (EN)</label>
              <input className="form-input" value={form.specialty_en} onChange={e => setForm(f => ({ ...f, specialty_en: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Biyografi (TR)</label>
              <textarea rows={3} className="form-input resize-none" value={form.bio_tr} onChange={e => setForm(f => ({ ...f, bio_tr: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Biyografi (EN)</label>
              <textarea rows={3} className="form-input resize-none" value={form.bio_en} onChange={e => setForm(f => ({ ...f, bio_en: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Fotoğraf</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="form-input" />
              {uploading && <p className="text-sm text-primary mt-1">Yükleniyor...</p>}
              {form.photo_url && <img src={form.photo_url} alt="" className="mt-2 h-20 w-20 rounded-full object-cover" />}
            </div>
            <div>
              <label className="form-label">Sıra</label>
              <input type="number" className="form-input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: +e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-5 h-5" />
              <label htmlFor="active" className="font-medium text-dark">Aktif (sitede görünür)</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">{editing ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditing(null); }} className="btn-outline">İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-gray-dark text-center py-10">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(m => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-48 bg-gray-light">
                {m.photo_url ? (
                  <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-primary/40 font-bold">{m.name?.charAt(0)}</span>
                  </div>
                )}
                {!m.is_active && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Pasif</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark">{m.name}</h3>
                <p className="text-primary text-sm">{m.title_tr}</p>
                <p className="text-gray-dark text-xs mt-1">{m.specialty_tr}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(m)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    <FaEdit size={12} /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                    <FaTrash size={12} /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-3 text-center py-20 text-gray-dark">
              Henüz ekip üyesi yok. "Yeni Ekle" butonuna tıklayın.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
