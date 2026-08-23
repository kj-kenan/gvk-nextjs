import { supabase } from './supabase';

// ---- Hizmetler ----
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*, service_images(*)')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getServiceBySlug(slug) {
  const { data, error } = await supabase
    .from('services')
    .select('*, service_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
}

// ---- Ekip ----
export async function getTeam() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

// ---- Blog ----
export async function getBlogCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name_tr', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getBlogPosts({ page = 1, categorySlug = null, limit = 9 } = {}) {
  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name_tr, name_en, slug)', { count: 'exact' })
    .eq('is_published', true)
    .order('publish_date', { ascending: false });

  if (categorySlug) {
    // Join with category to filter by slug
    const { data: cat } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: data, count, hasMore: count > page * limit };
}

export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name_tr, name_en, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) throw error;
  return data;
}

// ---- Galeri ----
export async function getGallery(categoryTr = null) {
  let query = supabase
    .from('clinic_gallery')
    .select('*')
    .order('display_order', { ascending: true });

  if (categoryTr) {
    query = query.eq('category_tr', categoryTr);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// ---- Testimonials ----
export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitTestimonial(formData) {
  // Upload photo to Supabase Storage
  const file = formData.get('pet_photo');
  const ext = file.name.split('.').pop();
  const fileName = `testimonials/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  const { data, error } = await supabase.from('testimonials').insert({
    pet_photo_url: publicUrl,
    owner_name: formData.get('owner_name') || '',
    pet_name: formData.get('pet_name') || '',
    description: formData.get('description') || '',
    email: formData.get('email'),
    is_approved: false,
  });

  if (error) throw error;
  return data;
}

// ---- Site Ayarları ----
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

// ---- Google Reviews ----
export async function getGoogleReviews() {
  const { data, error } = await supabase
    .from('google_reviews')
    .select('*')
    .eq('is_active', true)
    .order('review_time', { ascending: false });
  if (error) throw error;
  return data;
}
