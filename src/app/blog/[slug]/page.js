'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPostBySlug } from '@/lib/queries';
import Loading from '@/components/Loading';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa';

export default function BlogDetailPage({ params }) {
  const { t, getField } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(params.slug)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <Loading />;

  if (!post) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <p className="text-gray-dark text-xl mb-6">{t('Blog yazısı bulunamadı.', 'Blog post not found.')}</p>
        <Link href="/blog" className="btn-primary">{t('Blog\'a Dön', 'Back to Blog')}</Link>
      </div>
    );
  }

  const dateStr = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          {post.blog_categories && (
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
              {getField(post.blog_categories, 'name')}
            </span>
          )}
          <motion.h1
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {getField(post, 'title')}
          </motion.h1>
          {dateStr && (
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <FaCalendar /> {dateStr}
            </div>
          )}
        </div>
      </section>

      <article className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-dark mb-8 font-medium transition-colors">
            <FaArrowLeft /> {t('Blog\'a Dön', 'Back to Blog')}
          </Link>

          {post.cover_image_url && (
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg">
              <Image src={post.cover_image_url} alt={getField(post, 'title')} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-dark leading-relaxed text-lg whitespace-pre-wrap">
              {getField(post, 'content')}
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <Link href="/blog" className="btn-outline">{t('Diğer Blog Yazıları', 'Other Blog Posts')}</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
