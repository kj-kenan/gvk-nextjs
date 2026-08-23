'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'react-hot-toast';
import {
  FaHome, FaUsers, FaStethoscope, FaBlog, FaImages,
  FaHeart, FaCog, FaSignOutAlt, FaBars, FaTimes, FaEnvelope
} from 'react-icons/fa';

const MENU = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/ekip', label: 'Ekip', icon: FaUsers },
  { href: '/admin/hizmetler', label: 'Hizmetler', icon: FaStethoscope },
  { href: '/admin/blog', label: 'Blog', icon: FaBlog },
  { href: '/admin/galeri', label: 'Galeri', icon: FaImages },
  { href: '/admin/testimonials', label: 'Sizden Gelenler', icon: FaHeart },
  { href: '/admin/mesajlar', label: 'Mesajlar', icon: FaEnvelope },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: FaCog },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setUser(data.user);
      }
    });
  }, [pathname]);

  if (pathname === '/admin/login') {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">GV</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">GVK Admin</p>
              <p className="text-white/50 text-xs">Yönetim Paneli</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-white/60 lg:hidden">
            <FaTimes />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {MENU.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-primary text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-white/50 text-xs mb-3 px-4 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"
          >
            <FaSignOutAlt size={16} />
            Çıkış Yap
          </button>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all mt-1">
            ← Siteye Git
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-dark">
            <FaBars size={20} />
          </button>
          <h1 className="font-heading font-bold text-dark">GVK Admin</h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
