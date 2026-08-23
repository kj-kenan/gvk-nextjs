'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { FaEnvelope, FaEnvelopeOpen, FaTrash } from 'react-icons/fa';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = () => {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setMessages(data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id);
      setMessages(ms => ms.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu mesajı silmek istiyor musunuz?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    toast.success('Silindi.');
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-heading font-bold text-2xl text-dark">İletişim Mesajları</h1>
        {unreadCount > 0 && (
          <span className="bg-primary text-white text-sm font-bold px-2.5 py-1 rounded-full">{unreadCount} yeni</span>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-dark py-10">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-20 text-gray-dark bg-white rounded-2xl">Henüz mesaj yok.</div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  selected?.id === msg.id ? 'border-primary' : 'border-transparent hover:border-gray-200'
                } ${!msg.is_read ? 'shadow-md' : 'shadow-sm opacity-75'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.is_read
                      ? <FaEnvelopeOpen className="text-gray-400 shrink-0" />
                      : <FaEnvelope className="text-primary shrink-0" />}
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm truncate ${!msg.is_read ? 'text-dark' : 'text-gray-dark'}`}>{msg.name}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                {msg.subject && <p className="text-sm font-medium text-dark mt-2 truncate">{msg.subject}</p>}
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{msg.message}</p>
                <p className="text-xs text-gray-300 mt-2">{new Date(msg.created_at).toLocaleString('tr-TR')}</p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            {selected ? (
              <>
                <div className="border-b pb-4 mb-4">
                  <h2 className="font-bold text-dark text-lg">{selected.subject || '(Konu yok)'}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-gray-dark">
                    <span><strong>Gönderen:</strong> {selected.name}</span>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-gray-dark">
                    <span><strong>E-posta:</strong> <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a></span>
                    {selected.phone && <span><strong>Telefon:</strong> {selected.phone}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(selected.created_at).toLocaleString('tr-TR')}</p>
                </div>
                <p className="text-dark leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <div className="flex gap-3 mt-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Mesajınız'}`}
                    className="btn-primary text-sm"
                  >
                    E-posta ile Yanıtla
                  </a>
                  <button onClick={() => handleDelete(selected.id)} className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50">Sil</button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-dark py-16">
                <FaEnvelope size={40} className="mx-auto mb-3 text-gray-300" />
                <p>Detayları görmek için bir mesaj seçin.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
