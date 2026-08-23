'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ServiceCard({ service, index = 0 }) {
  const { getField } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
    >
      <Link
        href={`/hizmetler/${service.slug}`}
        className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
      >
        <div className="relative h-48 bg-gray-light overflow-hidden">
          {service.cover_image_url ? (
            <Image
              src={service.cover_image_url}
              alt={getField(service, 'title')}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-primary text-5xl">🏥</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-heading font-bold text-xl text-dark mb-2 group-hover:text-primary transition-colors">
            {getField(service, 'title')}
          </h3>
          <p className="text-gray-dark text-sm line-clamp-3">
            {getField(service, 'description')}
          </p>
          <span className="inline-block mt-4 text-primary text-sm font-semibold">
            Devamını oku →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
