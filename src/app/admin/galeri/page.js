'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const EMPTY = { title_tr: '', title_en: '', image_url: '', category_tr: '', category_en: '', display_order: 0 };

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchImages = () => {
    supabase.from('clinic_gallery').select('*').order('display_order')
      .then(({ data }) => setImages(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `gallery/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { toast.error('Yükleme hatası'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm(f => ({ ...f, image_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('clinic_gallery').insert({ ...form });
    if (error) { toast.error('Hata: ' + error.message); return; }
    toast.success('Fotoğraf eklendi!');
    setForm(EMPTY); setShowForm(false); fetchImages();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu fotoğrafı silmek istiyor musunuz?')) return;
    await supabase.from('clinic_gallery').delete().eq('id', id);
    toast.success('Silindi.'); fetchImages();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">Galeri Yönetimi</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'İptal' : 'Fotoğraf Ekle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-heading font-bold text-xl mb-5">Yeni Fotoğraf</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Başlık (TR) *</label>
              <input required className="form-input" value={form.title_tr} onChange={e => setForm(f => ({ ...f, title_tr: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Başlık (EN)</label>
              <input className="form-input" value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Kategori (TR) *</label>
              <input required className="form-input" value={form.category_tr} onChange={e => setForm(f => ({ ...f, category_tr: e.target.value }))} placeholder="Muayene Odası, Cerrahi, vb." />
            </div>
            <div>
              <label className="form-label">Kategori (EN)</label>
              <input className="form-input" value={form.category_en} onChange={e => setForm(f => ({ ...f, category_en: e.target.value }))} placeholder="Examination Room, Surgery, etc." />
            </div>
            <div>
              <label className="form-label">Fotoğraf *</label>
              <input type="file" accept="image/*" required onChange={handleUpload} className="form-input" />
              {uploading && <p className="text-sm text-primary mt-1">Yükleniyor...</p>}
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
            </div>
            <div>
              <label className="form-label">Sıra</label>
              <input type="number" className="form-input" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: +e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary" disabled={!form.image_url || uploading}>Ekle</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }} className="btn-outline">İptal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-dark py-10">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm aspect-square">
              <Image src={img.image_url} alt={img.title_tr} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs font-medium text-center px-2">{img.title_tr}</p>
                <p className="text-white/70 text-xs">{img.category_tr}</p>
                <button onClick={() => handleDelete(img.id)} className="mt-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-red-600">
                  <FaTrash size={10} /> Sil
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-5 text-center py-20 text-gray-dark">Henüz fotoğraf yok.</div>
          )}
        </div>
      )}
    </div>
  );
}
