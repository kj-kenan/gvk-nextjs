'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const slugify = (text) =>
  text.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const EMPTY = { title_tr: '', title_en: '', content_tr: '', content_en: '', slug: '', meta_description_tr: '', meta_description_en: '', is_published: false, category_id: null, cover_image_url: '' };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      supabase.from('blog_posts').select('*, blog_categories(name_tr)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name_tr'),
    ]).then(([{ data: p }, { data: c }]) => {
      setPosts(p || []);
      setCategories(c || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `blog/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) { toast.error('Yükleme hatası'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    setForm(f => ({ ...f, cover_image_url: publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, publish_date: form.is_published ? new Date().toISOString() : null };
    let error;
    if (editing) {
      ({ error } = await supabase.from('blog_posts').update(payload).eq('id', editing));
    } else {
      ({ error } = await supabase.from('blog_posts').insert(payload));
    }
    if (error) { toast.error('Hata: ' + error.message); return; }
    toast.success(editing ? 'Güncellendi!' : 'Yayınlandı!');
    setForm(EMPTY); setEditing(null); setShowForm(false);
    fetchData();
  };

  const handleEdit = (p) => {
    setForm({ ...p, category_id: p.category_id || null });
    setEditing(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu yazıyı silmek istiyor musunuz?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Silindi.'); fetchData();
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">Blog Yönetimi</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          {showForm ? <FaTimes /> : <FaPlus />} {showForm ? 'İptal' : 'Yeni Yazı'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-heading font-bold text-xl mb-6">{editing ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h2>
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
              <label className="form-label">Kategori</label>
              <select className="form-input" value={form.category_id || ''} onChange={e => set('category_id', e.target.value || null)}>
                <option value="">— Kategori seçin —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_tr}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">İçerik (TR) *</label>
              <textarea required rows={8} className="form-input resize-y" value={form.content_tr} onChange={e => set('content_tr', e.target.value)} />
            </div>
            <div>
              <label className="form-label">İçerik (EN)</label>
              <textarea rows={8} className="form-input resize-y" value={form.content_en} onChange={e => set('content_en', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Meta Açıklama (TR)</label>
                <textarea rows={2} className="form-input resize-none text-sm" maxLength={160} value={form.meta_description_tr} onChange={e => set('meta_description_tr', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Meta Açıklama (EN)</label>
                <textarea rows={2} className="form-input resize-none text-sm" maxLength={160} value={form.meta_description_en} onChange={e => set('meta_description_en', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="form-label">Kapak Fotoğrafı</label>
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="form-input" />
              {uploading && <p className="text-sm text-primary mt-1">Yükleniyor...</p>}
              {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 h-32 object-cover rounded-lg" />}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="published" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-5 h-5" />
              <label htmlFor="published" className="font-medium text-dark">Yayınla (hemen sitede görünsün)</label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editing ? 'Güncelle' : 'Yayınla'}</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); setEditing(null); }} className="btn-outline">İptal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-dark py-10">Yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark">Başlık</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark hidden md:table-cell">Kategori</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-dark">Durum</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-dark">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-dark text-sm">{p.title_tr}</p>
                    <p className="text-gray-400 text-xs font-mono">{p.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark hidden md:table-cell">{p.blog_categories?.name_tr || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-dark">Henüz blog yazısı yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
