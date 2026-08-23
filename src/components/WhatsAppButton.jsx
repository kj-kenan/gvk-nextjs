'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const number = '905330702424';
  const message = encodeURIComponent(t('Merhaba, randevu almak istiyorum.', 'Hello, I would like to make an appointment.'));

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full
                 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all
                 duration-300 hover:scale-110"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
