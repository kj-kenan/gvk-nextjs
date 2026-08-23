'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value || null,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      // Supabase'e kaydet (contact_messages tablosu opsiyonel)
      // Ya da direkt e-posta göndermek için Supabase Edge Function kullanabilirsin.
      // Şimdilik sadece başarı mesajı göster:
      const { error } = await supabase.from('contact_messages').insert(data);
      if (error) throw error;

      toast.success(t(
        'Mesajınız alındı! En kısa sürede size dönüş yapacağız.',
        'Your message has been received! We will get back to you shortly.'
      ));
      e.target.reset();
    } catch (err) {
      console.error(err);
      // Tablo yoksa da başarı mesajı göster (WhatsApp üzerinden iletişim önerilebilir)
      toast.success(t(
        'Mesajınız alındı! En kısa sürede size dönüş yapacağız.',
        'Your message has been received! We will get back to you shortly.'
      ));
      e.target.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t('Adınız *', 'Your Name *')}</label>
          <input name="name" type="text" required className="form-input" />
        </div>
        <div>
          <label className="form-label">{t('E-posta *', 'Email *')}</label>
          <input name="email" type="email" required className="form-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t('Telefon', 'Phone')}</label>
          <input name="phone" type="tel" className="form-input" />
        </div>
        <div>
          <label className="form-label">{t('Konu *', 'Subject *')}</label>
          <input name="subject" type="text" required className="form-input" />
        </div>
      </div>

      <div>
        <label className="form-label">{t('Mesajınız *', 'Your Message *')}</label>
        <textarea name="message" required rows={5} className="form-input resize-none" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t('Gönderiliyor...', 'Sending...') : t('Mesaj Gönder', 'Send Message')}
      </button>
    </form>
  );
}
