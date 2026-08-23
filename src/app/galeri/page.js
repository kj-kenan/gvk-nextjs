'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGallery } from '@/lib/queries';
import Loading from '@/components/Loading';

export default function GalleryPage() {
  const { t, getField } = useLanguage();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    getGallery(selectedCategory)
      .then((data) => {
        setImages(data);
        const uniqueCats = [...new Set(data.map(img => img.category_tr))];
        setCategories(uniqueCats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

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
            {t('Klinik Galerisi', 'Clinic Gallery')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('Kliniğimizden görüntüler', 'Images from our clinic')}
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-light">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  !selectedCategory ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
                }`}
              >
                {t('Tümü', 'All')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden rounded-xl shadow-md cursor-pointer h-64"
                  onClick={() => setLightbox(image)}
                >
                  <Image
                    src={image.image_url}
                    alt={getField(image, 'title')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">{getField(image, 'title')}</p>
                    <p className="text-white/70 text-xs">{getField(image, 'category')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-dark py-20">
              {t('Henüz galeri resmi bulunmamaktadır.', 'No gallery images available yet.')}
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl w-full"
          >
            <img
              src={lightbox.image_url}
              alt={getField(lightbox, 'title')}
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
            <button className="absolute top-3 right-3 text-white text-3xl hover:text-accent" onClick={() => setLightbox(null)}>×</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
