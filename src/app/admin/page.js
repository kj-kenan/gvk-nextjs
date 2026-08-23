'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FaUsers, FaStethoscope, FaBlog, FaImages, FaHeart } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    team: 0, services: 0, blog: 0, gallery: 0, testimonials: 0
  });

  useEffect(() => {
    Promise.all([
      supabase.from('team_members').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('services').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('blog_posts').select('id', { count: 'exact' }).eq('is_published', true),
      supabase.from('clinic_gallery').select('id', { count: 'exact' }),
      supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_approved', false),
    ]).then(([team, services, blog, gallery, testimonials]) => {
      setStats({
        team: team.count || 0,
        services: services.count || 0,
        blog: blog.count || 0,
        gallery: gallery.count || 0,
        testimonials: testimonials.count || 0,
      });
    });
  }, []);

  const cards = [
    { href: '/admin/ekip', label: 'Ekip Üyeleri', value: stats.team, icon: FaUsers, color: 'bg-blue-500' },
    { href: '/admin/hizmetler', label: 'Hizmetler', value: stats.services, icon: FaStethoscope, color: 'bg-green-500' },
    { href: '/admin/blog', label: 'Blog Yazıları', value: stats.blog, icon: FaBlog, color: 'bg-purple-500' },
    { href: '/admin/galeri', label: 'Galeri', value: stats.gallery, icon: FaImages, color: 'bg-orange-500' },
    { href: '/admin/testimonials', label: 'Onay Bekleyen', value: stats.testimonials, icon: FaHeart, color: 'bg-red-500', note: 'fotoğraf' },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-dark mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        {cards.map(({ href, label, value, icon: Icon, color, note }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="text-white text-xl" />
            </div>
            <p className="text-3xl font-bold text-dark mb-1">{value}</p>
            <p className="text-gray-dark text-sm font-medium">{label}</p>
            {note && <p className="text-xs text-red-500 font-medium mt-1">{note} onay bekliyor</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-dark mb-4">Hızlı Erişim</h2>
          <div className="space-y-3">
            {[
              ['/admin/ekip', 'Yeni Ekip Üyesi Ekle'],
              ['/admin/blog', 'Yeni Blog Yazısı Ekle'],
              ['/admin/testimonials', 'Fotoğrafları Onayla'],
              ['/admin/ayarlar', 'Site Ayarlarını Güncelle'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                className="block w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all text-sm font-medium text-dark"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-heading font-bold text-lg text-dark mb-4">Bilgiler</h2>
          <div className="space-y-2 text-sm text-gray-dark">
            <p>📌 <strong>Site:</strong> goztepevet.com.tr</p>
            <p>📌 <strong>Telefon:</strong> 0216 411 6520</p>
            <p>📌 <strong>WhatsApp:</strong> 0533 070 2424</p>
            <p className="pt-3 border-t border-gray-100">
              Supabase dashboard: <a href="https://supabase.com/dashboard" target="_blank" className="text-primary hover:underline">supabase.com/dashboard</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
