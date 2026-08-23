'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BlogCard({ post, index = 0 }) {
  const { getField } = useLanguage();

  const dateStr = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
      >
        <div className="relative h-48 bg-gray-light overflow-hidden">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={getField(post, 'title')}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-primary text-4xl">📝</span>
            </div>
          )}
        </div>
        <div className="p-6">
          {post.blog_categories && (
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {getField(post.blog_categories, 'name')}
            </span>
          )}
          <h3 className="font-heading font-bold text-lg text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {getField(post, 'title')}
          </h3>
          {dateStr && <p className="text-gray-dark text-xs">{dateStr}</p>}
        </div>
      </Link>
    </motion.div>
  );
}
