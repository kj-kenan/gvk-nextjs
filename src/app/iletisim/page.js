'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSiteSettings } from '@/lib/queries';
import ContactForm from '@/components/ContactForm';
import { FaMapMarkerAlt, FaPhone, FaMobileAlt, FaEnvelope, FaClock, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function ContactPage() {
  const { t, getField } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('İletişim', 'Contact')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('Bizimle iletişime geçin', 'Get in touch with us')}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-heading font-bold text-dark mb-6">
                {t('Mesaj Gönderin', 'Send a Message')}
              </h2>
              <ContactForm />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-heading font-bold text-dark mb-6">
                {t('İletişim Bilgileri', 'Contact Information')}
              </h2>

              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg flex-shrink-0">
                    <FaMapMarkerAlt className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-1">{t('Adres', 'Address')}</h3>
                    <p className="text-gray-dark">
                      {settings?.address || 'Fahrettin Kerim Gökay Caddesi No:259 Göztepe, Kadıköy/İstanbul'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg flex-shrink-0">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-1">{t('Telefon', 'Phone')}</h3>
                    <a href={`tel:${settings?.phone || '02164116520'}`} className="text-gray-dark hover:text-primary transition-colors block">
                      {settings?.phone || '0216 411 6520'}
                    </a>
                    {settings?.mobile && (
                      <a href={`tel:${settings.mobile}`} className="text-gray-dark hover:text-primary transition-colors block mt-1">
                        {settings.mobile}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg flex-shrink-0">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-1">{t('E-posta', 'Email')}</h3>
                    <a href={`mailto:${settings?.email || 'info@goztepevet.com.tr'}`} className="text-gray-dark hover:text-primary transition-colors">
                      {settings?.email || 'info@goztepevet.com.tr'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-white p-3 rounded-lg flex-shrink-0">
                    <FaClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-1">{t('Çalışma Saatleri', 'Working Hours')}</h3>
                    <p className="text-gray-dark">
                      {getField(settings || {}, 'working_hours_weekday') || (t('Pazartesi-Cuma: 09:00-19:00', 'Mon-Fri: 09:00-19:00'))}
                    </p>
                    <p className="text-gray-dark">
                      {getField(settings || {}, 'working_hours_weekend') || (t('Cumartesi: 09:00-17:00', 'Sat: 09:00-17:00'))}
                    </p>
                  </div>
                </div>

                {(settings?.instagram_url || settings?.facebook_url) && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-dark mb-3">{t('Sosyal Medya', 'Social Media')}</h3>
                    <div className="flex gap-3">
                      {settings.instagram_url && (
                        <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                           className="bg-primary text-white p-3 rounded-lg hover:bg-dark transition-colors">
                          <FaInstagram className="text-xl" />
                        </a>
                      )}
                      {settings.facebook_url && (
                        <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                           className="bg-primary text-white p-3 rounded-lg hover:bg-dark transition-colors">
                          <FaFacebook className="text-xl" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-heading font-bold text-dark mb-6 text-center">
              {t('Konumumuz', 'Our Location')}
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={settings?.google_maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5852.604965382592!2d29.068227455820825!3d40.9803931954377!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac796f0547693%3A0xad34aa614d5c9afb!2zR8OWWlRFUEUgVkVURVLEsE5FUiBLTMSwTsSwxJ7EsA!5e0!3m2!1str!2sus!4v1786879276026!5m2!1str!2sus'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Göztepe Veteriner Kliniği Konumu"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
