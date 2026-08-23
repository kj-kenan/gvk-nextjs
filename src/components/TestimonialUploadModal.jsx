'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitTestimonial } from '@/lib/queries';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

export default function TestimonialUploadModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await submitTestimonial(formData);
      toast.success(t(
        'Fotoğrafınız gönderildi! Onaylandıktan sonra yayınlanacak.',
        'Your photo has been submitted! It will be published after approval.'
      ));
      onClose();
      e.target.reset();
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(t('Bir hata oluştu. Lütfen tekrar deneyin.', 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-dark transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="font-heading font-bold text-2xl text-dark mb-6">
              {t('Fotoğrafını Paylaş', 'Share Your Photo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="form-label">{t('Evcil Hayvan Fotoğrafı *', 'Pet Photo *')}</label>
                <input
                  type="file"
                  name="pet_photo"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
                {preview && (
                  <img src={preview} alt="preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="form-label">{t('Evcil Hayvan Adı', 'Pet Name')}</label>
                <input type="text" name="pet_name" className="form-input" />
              </div>

              <div>
                <label className="form-label">{t('Adınız', 'Your Name')}</label>
                <input type="text" name="owner_name" className="form-input" />
              </div>

              <div>
                <label className="form-label">{t('E-posta *', 'Email *')}</label>
                <input type="email" name="email" required className="form-input" />
              </div>

              <div>
                <label className="form-label">{t('Açıklama', 'Description')}</label>
                <textarea name="description" rows={3} className="form-input resize-none" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? t('Gönderiliyor...', 'Submitting...')
                  : t('Gönder', 'Submit')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
