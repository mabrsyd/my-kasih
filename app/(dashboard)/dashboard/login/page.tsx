/**
 * Dashboard Login Page
 * Best Practice: React Hook Form + Zod validation + Auth.js signIn
 */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { LogIn, Loader2, Heart, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi').max(50),
  password: z.string().min(1, 'Password wajib diisi').min(4, 'Password minimal 4 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('Username atau password salah. Silakan coba lagi.');
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-rose-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">My Kasih</h1>
            <p className="text-slate-500 text-sm mt-2">Masuk ke dashboard CMS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username')}
                disabled={isSubmitting}
                placeholder="Masukkan username"
                className={`w-full px-4 py-3 border rounded-lg bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  errors.username ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1.5">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  disabled={isSubmitting}
                  placeholder="Masukkan password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-rose-500 text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
