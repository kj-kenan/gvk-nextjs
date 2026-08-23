'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    let query = supabase.from('testimonials').select('*').order('submitted_at', { ascending: false });
    if (filter === 'pending') query = query.eq('is_approved', false);
    if (filter === 'approved') query = query.eq('is_approved', true);
    query.then(({ data }) => setItems(data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [filter]);

  const approve = async (id) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: true, approved_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Hata!'); return; }
    toast.success('Onaylandı ve siteye eklendi!');
    fetchItems();
  };

  const reject = async (id) => {
    const { error } = await supabase.from('testimonials').update({ is_approved: false }).eq('id', id);
    if (error) { toast.error('Hata!'); return; }
    toast.success('Reddedildi.');
    fetchItems();
  };

  const remove = async (id) => {
    if (!confirm('Bu fotoğrafı kalıcı olarak silmek istiyor musunuz?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('Silindi.');
    fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">Sizden Gelenler</h1>
        <div className="flex gap-2">
          {['pending', 'approved', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-dark hover:bg-gray-50'}`}
            >
              {f === 'pending' ? 'Bekleyen' : f === 'approved' ? 'Onaylı' : 'Tümü'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-dark py-10">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 text-center text-gray-dark">
          {filter === 'pending' ? 'Bekleyen fotoğraf yok.' : 'Fotoğraf bulunamadı.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-56">
                <Image src={item.pet_photo_url} alt={item.pet_name || 'Pet'} fill className="object-cover" />
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${item.is_approved ? 'bg-green-500 text-white' : 'bg-yellow-400 text-dark'}`}>
                  {item.is_approved ? 'Onaylı' : 'Bekliyor'}
                </div>
              </div>
              <div className="p-4">
                {item.pet_name && <p className="font-bold text-dark">{item.pet_name}</p>}
                {item.owner_name && <p className="text-gray-dark text-sm">{item.owner_name}</p>}
                {item.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>}
                <p className="text-gray-400 text-xs mt-2">{item.email}</p>
                <p className="text-gray-400 text-xs">{new Date(item.submitted_at).toLocaleDateString('tr-TR')}</p>

                <div className="flex gap-2 mt-4">
                  {!item.is_approved ? (
                    <button onClick={() => approve(item.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                      <FaCheck size={12} /> Onayla
                    </button>
                  ) : (
                    <button onClick={() => reject(item.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 text-sm font-medium">
                      <FaTimes size={12} /> Geri Al
                    </button>
                  )}
                  <button onClick={() => remove(item.id)} className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
