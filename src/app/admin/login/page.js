'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error('E-posta veya şifre hatalı.');
    } else {
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">GV</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-dark">Admin Girişi</h1>
          <p className="text-gray-dark text-sm mt-1">Göztepe Veteriner Kliniği</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="form-label">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="admin@goztepevet.com.tr"
            />
          </div>
          <div>
            <label className="form-label">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}
