'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const slugify = (text) =>
  text.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const EMPTY = { title_tr: '', title_en: '', description_tr: '', description_en: '', slug: '', cover_image_url: '', is_active: true, display_order: 0 };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    supabase.from('services').select('*').order('display_order')
      .then(({ data }) => setServices(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `services/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { toast.error('Yükleme hatası'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm(f => ({ ...f, cover_image_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error;
    if (editing) {
      ({ error } = await supabase.from('services').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing));
    } else {
      ({ error } = await supabase.from('services').insert({ ...form }));
    }
    if (error) { toast.error('Hata: ' + error.message); return; }
    toast.success(editing ? 'Güncellendi!' : 'Eklendi!');
    setForm(EMPTY); setEditing(null); setShowForm(false); fetchServices();
  };

  const handleEdit = (s) => {
    setForm({ ...s }); setEditing(s.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu hizmeti silmek istiyor musunuz?')) return;
    await supabase.from('services').delete().eq('id', id);
    toast.success('Silindi.'); fetchServices();
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">Hizmet Yönetimi</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'İptal' : 'Yeni Hizmet'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-heading font-bold text-xl mb-5">{editing ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Başlık (TR) *</label>
                <input required className="form-input" value={form.title_tr}
                  onChange={e => set('title_tr', e.target.value)}
                  onBlur={e => !form.slug && set('slug', slugify(e.target.value))} />
              </div>
              <div>
                <label className="form-label">Başlık (EN)</label>
                <input className="form-input" value={form.title_en} onChange={e => set('title_en', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="form-label">URL (slug) *</label>
              <input required className="form-input font-mono text-sm" value={form.slug} onChange={e => set('slug', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Açıklama (TR) *</label>
              <textarea required rows={6} className="form-input resize-y" value={form.description_tr} onChange={e => set('description_tr', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Açıklama (EN)</label>
              <textarea rows={6} className="form-input resize-y" value={form.description_en} onChange={e => set('description_en', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Kapak Fotoğrafı</label>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="form-input" />
                {uploading && <p className="text-sm text-primary mt-1">Yükleniyor...</p>}
                {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
              </div>
              <div>
                <label className="form-label">Sıra</label>
                <input type="number" className="form-input" value={form.display_order} onChange={e => set('display_order', +e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="sactive" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-5 h-5" />
              <label htmlFor="sactive" className="font-medium text-dark">Aktif</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editing ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); setEditing(null); }} className="btn-outline">İptal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-dark py-10">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-40 bg-gray-light">
                {s.cover_image_url
                  ? <Image src={s.cover_image_url} alt={s.title_tr} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">🏥</div>}
                {!s.is_active && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Pasif</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark mb-1">{s.title_tr}</h3>
                <p className="text-gray-dark text-sm line-clamp-2">{s.description_tr}</p>
                <p className="text-xs font-mono text-gray-400 mt-2">{s.slug}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(s)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                    <FaEdit size={12} /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && <div className="col-span-3 text-center py-20 text-gray-dark">Henüz hizmet yok.</div>}
        </div>
      )}
    </div>
  );
}
