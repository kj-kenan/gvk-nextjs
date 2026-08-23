# GVK Next.js — Kurulum & Deploy Rehberi

Bu rehber seni adım adım sıfırdan canlıya götürür. Yaklaşık 30-45 dakika sürer.

---

## ADIM 1: Supabase Hesabı & Proje

1. **https://supabase.com** adresine git → "Start your project" → GitHub ile giriş yap (ücretsiz)
2. "New project" tıkla:
   - Name: `gvk`
   - Database Password: güçlü bir şifre yaz (kaydet!)
   - Region: **West EU (Ireland)** seç (Türkiye'ye en yakın)
3. Proje oluşturulduktan sonra (yaklaşık 1-2 dk bekle)

### 1a. Tabloları oluştur

4. Sol menüde **SQL Editor** tıkla → **New Query**
5. `supabase/schema.sql` dosyasının tüm içeriğini kopyala → yapıştır → **Run** butonuna bas
6. Tablolar oluştu ✓

### 1b. Storage Bucket oluştur

7. Sol menüde **Storage** tıkla → **New Bucket**
8. Name: `images` | Public: **AÇIK** (toggle'ı aç) → Create bucket
9. Sol menüde Storage → Policies → `images` bucket'ına tıkla → **New Policy** → "For full customization" seç:
   - Policy Name: `Public read`
   - Allowed operation: SELECT
   - Target roles: (boş bırak = public)
   - WITH CHECK expression: `true`
   - → Save
10. Aynı şekilde **INSERT** için de policy ekle (authenticated users için)

### 1c. Supabase bilgilerini al

11. Sol menüde **Settings** → **API**
12. Şunları kopyala:
    - **Project URL**: `https://xxxx.supabase.co`
    - **anon (public) key**: `eyJ...`
    - **service_role key**: `eyJ...` (bunu kimseyle paylaşma!)

---

## ADIM 2: Admin Kullanıcısı Oluştur

Supabase dashboard'da:
1. Sol menü → **Authentication** → **Users** → **Add User**
2. Email: `admin@goztepevet.com.tr` (ya da istediğin)
3. Password: güçlü bir şifre
4. "Auto Confirm User" işaretle → Create User

Bu email & şifreyi `/admin/login` sayfasında kullanacaksın.

---

## ADIM 3: Projeyi GitHub'a yükle

```bash
# Proje klasöründe terminal aç
cd gvk-nextjs

# Git başlat
git init
git add .
git commit -m "Initial Next.js + Supabase migration"

# GitHub'da yeni repo oluştur: github.com/new
# Repo adı: gvk-nextjs (private olabilir)
# Sonra:
git remote add origin https://github.com/KULLANICI_ADIN/gvk-nextjs.git
git push -u origin main
```

---

## ADIM 4: Vercel'e Deploy

1. **https://vercel.com** → GitHub ile giriş yap (ücretsiz)
2. **"New Project"** → GitHub reposunu seç (`gvk-nextjs`)
3. Framework: **Next.js** (otomatik algılar)
4. **Environment Variables** bölümüne şunları ekle:

```
NEXT_PUBLIC_SUPABASE_URL       = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = eyJ...
SUPABASE_SERVICE_ROLE_KEY      = eyJ...
NEXT_PUBLIC_SITE_URL           = https://goztepevet.com.tr
```

5. **Deploy** butonuna bas → 2-3 dakika bekle ✓

Vercel sana bir URL verir: `gvk-nextjs.vercel.app` — site hazır!

---

## ADIM 5: Alan adını bağla (goztepevet.com.tr)

### Vercel tarafında:
1. Vercel → projen → **Settings** → **Domains**
2. `goztepevet.com.tr` ekle → Vercel sana DNS kayıtları gösterir

### Domain sağlayıcında (nerede aldıysan):
3. Domain DNS ayarlarına gir
4. Vercel'in gösterdiği şu kayıtları ekle:
   - **A kaydı**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
5. 10-30 dakika içinde aktif olur

---

## ADIM 6: İlk içeriği gir

Sitenin admin paneline git: `goztepevet.com.tr/admin`

Giriş yap ve şunları ekle:
1. **Ekip** → ekip üyelerini ekle + fotoğraf yükle
2. **Hizmetler** → hizmetleri ekle
3. **Galeri** → klinik fotoğraflarını yükle
4. **Ayarlar** → iletişim bilgilerini güncelle

---

## Sonradan içerik güncellemek için

Her değişikliği git push yapmanı gerektirmez!
- Metin, fotoğraf, ekip güncellemeleri → `/admin` panelinden yaparsın
- Kod değişikliği gerekirse → GitHub'a push → Vercel otomatik deploy eder

---

## Sık kullanılan URL'ler

| | URL |
|---|---|
| **Site** | https://goztepevet.com.tr |
| **Admin panel** | https://goztepevet.com.tr/admin |
| **Supabase** | https://supabase.com/dashboard |
| **Vercel** | https://vercel.com/dashboard |

---

## Sorun çıkarsa

**Site açılmıyor:**
- Vercel dashboard → Functions loglarına bak
- Environment variables doğru mu?

**Resimler yüklenmiyor:**
- Supabase Storage → `images` bucket public mi?
- Storage policy'ler eklenmiş mi?

**Admin girişi çalışmıyor:**
- Supabase → Authentication → Users → kullanıcı var mı?
- Şifre doğru mu?

**Herhangi bir sorun için:** Supabase dashboard → Logs bölümü çok yardımcı olur.
