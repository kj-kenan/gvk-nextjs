-- =========================================
-- GVK (Göztepe Veteriner Kliniği) Schema
-- Supabase SQL Editor'a kopyala ve çalıştır
-- =========================================

-- Ekip Üyeleri
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  title_tr VARCHAR(200) DEFAULT '',
  title_en VARCHAR(200) DEFAULT '',
  specialty_tr VARCHAR(300) DEFAULT '',
  specialty_en VARCHAR(300) DEFAULT '',
  bio_tr TEXT DEFAULT '',
  bio_en TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hizmetler
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  title_tr VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) DEFAULT '',
  description_tr TEXT NOT NULL,
  description_en TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  slug VARCHAR(220) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hizmet Görselleri (galeri)
CREATE TABLE IF NOT EXISTS service_images (
  id BIGSERIAL PRIMARY KEY,
  service_id BIGINT REFERENCES services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Blog Kategorileri
CREATE TABLE IF NOT EXISTS blog_categories (
  id BIGSERIAL PRIMARY KEY,
  name_tr VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) DEFAULT '',
  slug VARCHAR(120) UNIQUE NOT NULL
);

-- Blog Yazıları
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES blog_categories(id) ON DELETE SET NULL,
  title_tr VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) DEFAULT '',
  content_tr TEXT NOT NULL,
  content_en TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  slug VARCHAR(220) UNIQUE NOT NULL,
  meta_description_tr VARCHAR(160) DEFAULT '',
  meta_description_en VARCHAR(160) DEFAULT '',
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Klinik Galerisi
CREATE TABLE IF NOT EXISTS clinic_gallery (
  id BIGSERIAL PRIMARY KEY,
  title_tr VARCHAR(200) NOT NULL,
  title_en VARCHAR(200) DEFAULT '',
  image_url TEXT NOT NULL,
  category_tr VARCHAR(100) NOT NULL,
  category_en VARCHAR(100) DEFAULT '',
  display_order INTEGER DEFAULT 0
);

-- Sizden Gelenler (Testimonials)
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  pet_photo_url TEXT NOT NULL,
  owner_name VARCHAR(200) DEFAULT '',
  pet_name VARCHAR(200) DEFAULT '',
  description TEXT DEFAULT '',
  email VARCHAR(254) NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- İletişim Mesajları
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  subject VARCHAR(300) DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth all contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Google Reviews
CREATE TABLE IF NOT EXISTS google_reviews (
  id BIGSERIAL PRIMARY KEY,
  author_name VARCHAR(200) NOT NULL,
  author_url TEXT DEFAULT '',
  profile_photo_url TEXT DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_time TIMESTAMPTZ NOT NULL,
  relative_time_description VARCHAR(100) DEFAULT '',
  language VARCHAR(10) DEFAULT 'tr',
  review_id VARCHAR(200) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Ayarları (tek satır, id=1)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  address TEXT DEFAULT 'Fahrettin Kerim Gökay Caddesi No:259 Göztepe, Kadıköy/İstanbul',
  phone VARCHAR(50) DEFAULT '0216 411 6520',
  mobile VARCHAR(50) DEFAULT '0533 070 2424',
  email VARCHAR(254) DEFAULT 'info@goztepevet.com.tr',
  working_hours_weekday_tr VARCHAR(200) DEFAULT 'Pazartesi - Cuma: 09:00 - 19:00',
  working_hours_weekday_en VARCHAR(200) DEFAULT 'Monday - Friday: 09:00 - 19:00',
  working_hours_weekend_tr VARCHAR(200) DEFAULT 'Cumartesi: 09:00 - 17:00',
  working_hours_weekend_en VARCHAR(200) DEFAULT 'Saturday: 09:00 - 17:00',
  google_maps_embed_url TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5852.604965382592!2d29.068227455820825!3d40.9803931954377!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac796f0547693%3A0xad34aa614d5c9afb!2zR8OWWlRFUEUgVkVURVLEsE5FUiBLTMSwTsSwxJ7EsA!5e0!3m2!1str!2sus!4v1786879276026!5m2!1str!2sus',
  whatsapp_number VARCHAR(20) DEFAULT '905330702424',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Site ayarlarını varsayılan değerlerle ekle
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =========================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read service_images" ON service_images FOR SELECT USING (true);
CREATE POLICY "Public read blog_categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read clinic_gallery" ON clinic_gallery FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read google_reviews" ON google_reviews FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Herkes testimonial gönderebilir (insert)
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);

-- Admin işlemleri için authenticated users
CREATE POLICY "Auth all team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all service_images" ON service_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all blog_categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all clinic_gallery" ON clinic_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all google_reviews" ON google_reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- STORAGE BUCKETS
-- Supabase Dashboard > Storage bölümünde oluştur
-- veya bu SQL'i çalıştır
-- =========================================

-- Not: Storage bucket'ları SQL yerine Supabase dashboard'dan oluşturmak daha kolay.
-- Dashboard > Storage > New Bucket:
--   1. "images" bucket (public: true)
--      - team/ klasörü için: team/
--      - services/ klasörü için: services/
--      - blog/ klasörü için: blog/
--      - gallery/ klasörü için: gallery/
--      - testimonials/ klasörü için: testimonials/
