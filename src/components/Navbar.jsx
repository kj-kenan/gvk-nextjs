'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const NAV_LINKS = [
  { href: '/', labelTr: 'Ana Sayfa', labelEn: 'Home' },
  { href: '/hizmetler', labelTr: 'Hizmetler', labelEn: 'Services' },
  { href: '/ekibimiz', labelTr: 'Ekibimiz', labelEn: 'Team' },
  { href: '/blog', labelTr: 'Blog', labelEn: 'Blog' },
  { href: '/galeri', labelTr: 'Galeri', labelEn: 'Gallery' },
  { href: '/sizden-gelenler', labelTr: 'Sizden Gelenler', labelEn: 'From You' },
  { href: '/iletisim', labelTr: 'İletişim', labelEn: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isHome = pathname === '/';
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Göztepe Veteriner Kliniği"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className={`font-heading font-bold text-lg leading-tight ${scrolled || !isHome ? 'text-dark' : 'text-white'}`}>
              Göztepe Veteriner
            </p>
            <p className={`text-xs leading-tight ${scrolled || !isHome ? 'text-gray-dark' : 'text-white/80'}`}>
              Kliniği
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-[15px] font-medium tracking-wide transition-colors duration-200 ${
                pathname === link.href
                  ? 'bg-primary text-white'
                  : scrolled || !isHome
                  ? 'text-dark hover:text-primary'
                  : 'text-white hover:text-white/80'
              }`}
              style={{ fontFamily: "'Nunito', 'Inter', sans-serif" }}
            >
              {lang === 'tr' ? link.labelTr : link.labelEn}
            </Link>
          ))}
          <button
            onClick={toggleLang}
            className={`ml-4 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
              scrolled || !isHome
                ? 'border-primary text-primary hover:bg-primary hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-primary'
            }`}
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
              scrolled || !isHome
                ? 'border-primary text-primary'
                : 'border-white text-white'
            }`}
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={scrolled || !isHome ? 'text-dark' : 'text-white'}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-xl border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary text-white'
                    : 'text-dark hover:bg-gray-light'
                }`}
              >
                {lang === 'tr' ? link.labelTr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
