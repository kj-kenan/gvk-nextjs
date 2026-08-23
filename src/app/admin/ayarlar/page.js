'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single()
      .then(({ data }) => setSettings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('site_settings').update({
      ...settings,
      updated_at: new Date().toISOString()
    }).eq('id', 1);
    if (error) { toast.error('Kaydetme hatası: ' + error.message); }
    else { toast.success('Ayarlar kaydedildi!'); }
    setSaving(false);
  };

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  if (loading) return <p className="text-gray-dark text-center py-10">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-dark mb-6">Site Ayarları</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg mb-5 text-dark border-b pb-3">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="form-label">Adres</label>
              <textarea rows={2} className="form-input resize-none" value={settings?.address || ''} onChange={e => update('address', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Sabit Telefon</label>
              <input className="form-input" value={settings?.phone || ''} onChange={e => update('phone', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Cep Telefonu</label>
              <input className="form-input" value={settings?.mobile || ''} onChange={e => update('mobile', e.target.value)} />
            </div>
            <div>
              <label className="form-label">E-posta</label>
              <input type="email" className="form-input" value={settings?.email || ''} onChange={e => update('email', e.target.value)} />
            </div>
            <div>
              <label className="form-label">WhatsApp (ülke kodu ile, örn: 905330702424)</label>
              <input className="form-input" value={settings?.whatsapp_number || ''} onChange={e => update('whatsapp_number', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg mb-5 text-dark border-b pb-3">Çalışma Saatleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Hafta içi (TR)</label>
              <input className="form-input" value={settings?.working_hours_weekday_tr || ''} onChange={e => update('working_hours_weekday_tr', e.target.value)} placeholder="Pazartesi - Cuma: 09:00 - 19:00" />
            </div>
            <div>
              <label className="form-label">Hafta içi (EN)</label>
              <input className="form-input" value={settings?.working_hours_weekday_en || ''} onChange={e => update('working_hours_weekday_en', e.target.value)} placeholder="Monday - Friday: 09:00 - 19:00" />
            </div>
            <div>
              <label className="form-label">Hafta sonu (TR)</label>
              <input className="form-input" value={settings?.working_hours_weekend_tr || ''} onChange={e => update('working_hours_weekend_tr', e.target.value)} placeholder="Cumartesi: 09:00 - 17:00" />
            </div>
            <div>
              <label className="form-label">Hafta sonu (EN)</label>
              <input className="form-input" value={settings?.working_hours_weekend_en || ''} onChange={e => update('working_hours_weekend_en', e.target.value)} placeholder="Saturday: 09:00 - 17:00" />
            </div>
          </div>
        </div>

        {/* Social & Map */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg mb-5 text-dark border-b pb-3">Sosyal Medya & Harita</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Instagram URL</label>
              <input className="form-input" value={settings?.instagram_url || ''} onChange={e => update('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="form-label">Facebook URL</label>
              <input className="form-input" value={settings?.facebook_url || ''} onChange={e => update('facebook_url', e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="form-label">Google Maps Embed URL</label>
              <textarea rows={3} className="form-input resize-none text-xs" value={settings?.google_maps_embed_url || ''} onChange={e => update('google_maps_embed_url', e.target.value)} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60 text-base px-12">
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
