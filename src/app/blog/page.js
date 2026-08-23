'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPosts, getBlogCategories } from '@/lib/queries';
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';

export default function BlogPage() {
  const { t, getField } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getBlogCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getBlogPosts({ page, categorySlug: selectedCategory })
      .then(({ posts: newPosts, hasMore: more }) => {
        setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts]);
        setHasMore(more);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, selectedCategory]);

  const changeCategory = (slug) => {
    setSelectedCategory(slug);
    setPage(1);
    setPosts([]);
  };

  if (loading && page === 1) return <Loading />;

  return (
    <div className="pt-28 md:pt-32 min-h-screen">
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Blog
          </motion.h1>
          <motion.p
            className="text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('Evcil hayvan bakımı hakkında faydalı bilgiler', 'Useful information about pet care')}
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-light">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => changeCategory(null)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  !selectedCategory ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
                }`}
              >
                {t('Tümü', 'All')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => changeCategory(cat.slug)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat.slug ? 'bg-primary text-white' : 'bg-white text-dark hover:bg-primary hover:text-white'
                  }`}
                >
                  {getField(cat, 'name')}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="btn-outline disabled:opacity-50"
                  >
                    {loading ? t('Yükleniyor...', 'Loading...') : t('Daha Fazla Yükle', 'Load More')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-dark py-20">
              {t('Henüz blog yazısı bulunmamaktadır.', 'No blog posts available yet.')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
