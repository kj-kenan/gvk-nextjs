'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTestimonials } from '@/lib/queries';
import TestimonialCard from '@/components/TestimonialCard';
import TestimonialUploadModal from '@/components/TestimonialUploadModal';
import Loading from '@/components/Loading';

export default function TestimonialsPage() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('Sizden Gelenler', 'From You')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t("Evcil dostlarınızın mutlu anlarını bizimle paylaşın", "Share your pets' happy moments with us")}
          </motion.p>
          <motion.button
            onClick={() => setModalOpen(true)}
            className="btn-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            {t('Fotoğrafını Paylaş', 'Share Your Photo')}
          </motion.button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {testimonials.map((t, index) => (
                <TestimonialCard key={t.id} testimonial={t} index={index} onClick={setLightbox} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-dark text-lg mb-6">{t('Henüz paylaşım bulunmamaktadır.', 'No testimonials yet.')}</p>
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                {t('İlk Fotoğrafı Paylaş!', 'Share the First Photo!')}
              </button>
            </div>
          )}
        </div>
      </section>

      <TestimonialUploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl w-full"
          >
            <img
              src={lightbox.pet_photo_url}
              alt={lightbox.pet_name || 'Pet'}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {(lightbox.pet_name || lightbox.owner_name || lightbox.description) && (
              <div className="bg-black/70 text-white p-5 rounded-b-xl">
                {lightbox.pet_name && <p className="text-xl font-bold">{lightbox.pet_name}</p>}
                {lightbox.owner_name && <p className="text-white/80">{lightbox.owner_name}</p>}
                {lightbox.description && <p className="text-white/70 text-sm mt-2">{lightbox.description}</p>}
              </div>
            )}
            <button className="absolute top-3 right-3 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
