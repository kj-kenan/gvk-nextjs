'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Göztepe Veteriner" className="w-12 h-auto" />
              <div>
                <p className="font-heading font-bold text-lg">Göztepe Veteriner</p>
                <p className="text-white/60 text-xs">Kliniği</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t(
                'Patili dostlarınızın sağlığı için modern veteriner hizmetleri sunuyoruz.',
                'Providing modern veterinary services for the health of your beloved pets.'
              )}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">{t('Hızlı Bağlantılar', 'Quick Links')}</h3>
            <ul className="space-y-2">
              {[
                ['/hizmetler', t('Hizmetler', 'Services')],
                ['/ekibimiz', t('Ekibimiz', 'Team')],
                ['/blog', 'Blog'],
                ['/galeri', t('Galeri', 'Gallery')],
                ['/sizden-gelenler', t('Sizden Gelenler', 'From You')],
                ['/iletisim', t('İletişim', 'Contact')],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">{t('İletişim', 'Contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <p className="text-white/70 text-sm">
                  Fahrettin Kerim Gökay Caddesi No:259<br />Göztepe, Kadıköy/İstanbul
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:02164116520" className="text-white/70 hover:text-white text-sm transition-colors">
                  0216 411 6520
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:05330702424" className="text-white/70 hover:text-white text-sm transition-colors">
                  0533 070 2424
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Göztepe Veteriner Kliniği. {t('Tüm hakları saklıdır.', 'All rights reserved.')}
          </p>
          <div className="flex items-center space-x-3">
            <a
              href="https://www.instagram.com/gveteriner"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/goztepevet"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
