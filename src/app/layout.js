import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    default: 'Göztepe Veteriner Kliniği | Kadıköy İstanbul',
    template: '%s | Göztepe Veteriner Kliniği',
  },
  description:
    'Göztepe Veteriner Kliniği - Kadıköy İstanbul. Dahiliye, cerrahi, radyoloji, kardiyoloji, KBB, anesteziyoloji ve acil veteriner hizmetleri.',
  metadataBase: new URL('https://goztepevet.com.tr'),
  openGraph: {
    siteName: 'Göztepe Veteriner Kliniği',
    locale: 'tr_TR',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster position="top-right" />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
