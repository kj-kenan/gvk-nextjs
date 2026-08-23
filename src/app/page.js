'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { getServices, getTeam, getBlogPosts, getTestimonials } from '@/lib/queries';
import TeamMemberCard from '@/components/TeamMemberCard';
import BlogCard from '@/components/BlogCard';
import TestimonialCard from '@/components/TestimonialCard';

// Static service cards (same as original)
const STATIC_SERVICES = [
  { slug: 'laboratuvar', titleTr: 'Laboratuvar', titleEn: 'Laboratory', descTr: 'Kan tahlili, idrar analizi ve kapsamlı teşhis testleri kliniğimizde.', descEn: 'Blood tests, urinalysis and comprehensive diagnostic tests at our clinic.', icon: '🧪' },
  { slug: 'radyoloji', titleTr: 'Radyoloji', titleEn: 'Radiology', descTr: 'Dijital röntgen ve ultrason ile hassas görüntüleme hizmetleri.', descEn: 'Precise imaging services with digital X-ray and ultrasound.', icon: '🩻' },
  { slug: 'dahiliye', titleTr: 'Dahiliye', titleEn: 'Internal Medicine', descTr: 'İç hastalıkların teşhis ve tedavisinde uzman veteriner hizmetleri.', descEn: 'Expert veterinary services in diagnosis and treatment of internal diseases.', icon: '❤️' },
  { slug: 'cerrahi', titleTr: 'Cerrahi', titleEn: 'Surgery', descTr: 'Modern ekipmanlarla gerçekleştirilen güvenli operasyon hizmetleri.', descEn: 'Safe surgical procedures with modern equipment.', icon: '🏥' },
  { slug: 'kbb', titleTr: 'KBB', titleEn: 'ENT', descTr: 'Kulak, burun ve boğaz hastalıklarının uzman tanı ve tedavi hizmetleri.', descEn: 'Expert diagnosis and treatment of ear, nose and throat diseases.', icon: '👂' },
  { slug: 'kardiyoloji', titleTr: 'Kardiyoloji', titleEn: 'Cardiology', descTr: 'Kalp ve damar hastalıklarının teşhis, takip ve tedavi hizmetleri.', descEn: 'Diagnosis, monitoring and treatment of heart and vascular diseases.', icon: '💗' },
  { slug: 'anesteziyoloji', titleTr: 'Anesteziyoloji', titleEn: 'Anesthesiology', descTr: 'Güvenli operasyonlar için uzman anestezi uygulamaları.', descEn: 'Expert anesthesia applications for safe operations.', icon: '💉' },
  { slug: 'acil', titleTr: 'Acil', titleEn: 'Emergency', descTr: 'Ani gelişen durumlarda hızlı müdahale ve acil veteriner bakımı.', descEn: 'Rapid response and emergency veterinary care for sudden situations.', icon: '🚨' },
];

export default function Home() {
  const { t } = useLanguage();
  const [team, setTeam] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    Promise.all([
      getTeam().catch(() => []),
      getBlogPosts({ limit: 3 }).catch(() => ({ posts: [] })),
      getTestimonials().catch(() => []),
    ]).then(([teamData, blogData, testimonialsData]) => {
      setTeam(teamData || []);
      setBlogPosts(blogData?.posts || []);
      setTestimonials(testimonialsData || []);
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=2000)' }}
        >
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('Patili Dostlarınızın Sağlığı İçin Yanınızdayız', "We Are Here for Your Pets' Health")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t(
              'Modern veteriner hizmetlerimizle patili dostlarımıza hak ettikleri ilgiyi gösteriyoruz.',
              'We provide the care your beloved pets deserve with our modern veterinary services.'
            )}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/hizmetler" className="btn-primary">{t('Hizmetlerimiz', 'Our Services')}</Link>
            <Link href="/iletisim" className="btn-secondary">{t('İletişim', 'Contact')}</Link>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaArrowDown className="text-white text-3xl" />
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">{t('Hizmetlerimiz', 'Our Services')}</h2>
            <p className="section-subtitle">
              {t('Patili dostlarınız için sunduğumuz profesyonel veteriner hizmetleri', 'Professional veterinary services we offer for your pet friends')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_SERVICES.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              >
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="flex flex-col w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                >
                  <div className="flex items-center justify-center py-10 bg-gradient-to-b from-[#eef1f6] to-white">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
                      {service.icon}
                    </span>
                  </div>
                  <div className="px-6 pb-8 text-center">
                    <h3 className="text-xl font-heading font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                      {t(service.titleTr, service.titleEn)}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {t(service.descTr, service.descEn)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">{t('Uzman Ekibimiz', 'Our Expert Team')}</h2>
              <p className="section-subtitle">{t('Alanında uzman veteriner hekimlerimiz', 'Our expert veterinarians')}</p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-8">
              {team.map((member, index) => (
                <div key={member.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-xs">
                  <TeamMemberCard member={member} index={index} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/ekibimiz" className="btn-outline">{t('Tüm Ekibimiz', 'Meet Our Team')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-gray-light">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">{t('Blog Yazılarımız', 'Our Blog Posts')}</h2>
              <p className="section-subtitle">{t('Evcil hayvan bakımı hakkında faydalı bilgiler', 'Useful information about pet care')}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {blogPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/blog" className="btn-outline">{t('Tüm Blog Yazıları', 'All Blog Posts')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="section-title">{t('Sizden Gelenler', 'From You')}</h2>
              <p className="section-subtitle">{t("Evcil dostlarınızın mutlu anlarını bizimle paylaşın", "Share your pets' happy moments with us")}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {testimonials.slice(0, 8).map((t, index) => (
                <TestimonialCard key={t.id} testimonial={t} index={index} onClick={setLightboxImage} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/sizden-gelenler" className="btn-primary">{t('Fotoğrafını Paylaş', 'Share Your Photo')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Google Map */}
      <section className="py-20 bg-gray-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">{t('Konumumuz', 'Our Location')}</h2>
            <p className="section-subtitle">{t('Bizi ziyaret edin', 'Come visit us')}</p>
          </motion.div>
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5852.604965382592!2d29.068227455820825!3d40.9803931954377!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac796f0547693%3A0xad34aa614d5c9afb!2zR8OWWlRFUEUgVkVURVLEsE5FUiBLTMSwTsSwxJ7EsA!5e0!3m2!1str!2sus!4v1786879276026!5m2!1str!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Göztepe Veteriner Kliniği"
            />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl w-full"
          >
            <img
              src={lightboxImage.pet_photo_url}
              alt={lightboxImage.pet_name || 'Pet'}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            {(lightboxImage.pet_name || lightboxImage.owner_name) && (
              <div className="bg-black/70 text-white p-4 rounded-b-xl">
                {lightboxImage.pet_name && <p className="font-bold">{lightboxImage.pet_name}</p>}
                {lightboxImage.owner_name && <p className="text-sm text-white/80">{lightboxImage.owner_name}</p>}
              </div>
            )}
            <button
              className="absolute top-3 right-3 text-white text-3xl hover:text-accent"
              onClick={() => setLightboxImage(null)}
            >×</button>
          </motion.div>
        </div>
      )}
    </>
  );
}
