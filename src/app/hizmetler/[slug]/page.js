'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getServiceBySlug } from '@/lib/queries';
import Loading from '@/components/Loading';
import { FaArrowLeft } from 'react-icons/fa';

export default function ServiceDetailPage({ params }) {
  const { t, getField } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getServiceBySlug(params.slug)
      .then(setService)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <Loading />;

  if (!service) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <p className="text-gray-dark text-xl mb-6">{t('Hizmet bulunamadı.', 'Service not found.')}</p>
        <Link href="/hizmetler" className="btn-primary">{t('Hizmetlere Dön', 'Back to Services')}</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getField(service, 'title')}
          </motion.h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/hizmetler" className="inline-flex items-center gap-2 text-primary hover:text-dark transition-colors mb-8 font-medium">
            <FaArrowLeft /> {t('Tüm Hizmetler', 'All Services')}
          </Link>

          {/* Cover image */}
          {service.cover_image_url && (
            <div className="relative h-80 rounded-2xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={service.cover_image_url}
                alt={getField(service, 'title')}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-dark leading-relaxed text-lg whitespace-pre-wrap">
              {getField(service, 'description')}
            </p>
          </div>

          {/* Gallery images */}
          {service.service_images?.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-2xl text-dark mb-6">
                {t('Galeri', 'Gallery')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.service_images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative h-48 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
                    onClick={() => setLightbox(img.image_url)}
                  >
                    <Image src={img.image_url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gray-light rounded-2xl p-8 text-center">
            <h3 className="font-heading font-bold text-2xl text-dark mb-4">
              {t('Randevu Almak İster misiniz?', 'Would You Like to Make an Appointment?')}
            </h3>
            <p className="text-gray-dark mb-6">
              {t('Evcil dostunuz için en iyi bakımı sunmaya hazırız.', 'We are ready to provide the best care for your pet.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/iletisim" className="btn-primary">{t('İletişime Geç', 'Contact Us')}</Link>
              <a href="tel:02164116520" className="btn-outline">0216 411 6520</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-xl" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}
    </div>
  );
}
