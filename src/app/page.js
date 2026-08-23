'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getServices } from '@/lib/queries';
import ServiceCard from '@/components/ServiceCard';
import Loading from '@/components/Loading';

export const metadata = {
  title: 'Hizmetlerimiz',
  description: 'Göztepe Veteriner Kliniği — Dahiliye, cerrahi, radyoloji, kardiyoloji, KBB, anesteziyoloji ve acil veteriner hizmetleri.',
};

export default function ServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(setServices)
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
            {t('Hizmetlerimiz', 'Our Services')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t(
              'Evcil dostlarınız için sunduğumuz profesyonel veteriner hizmetleri',
              'Professional veterinary services for your beloved pets'
            )}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-dark py-20">
              {t('Henüz hizmet bulunmamaktadır.', 'No services available yet.')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
