'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/lib/store/ui.store';
import { ToastProvider } from '@/components/dashboard';
import {
  LayoutDashboard, Home, Heart, Brain, Image, Mail, Settings,
  Menu, LogOut, Loader2,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { data: session, status } = useSession();

  // Login page: tidak perlu sidebar
  const isLoginPage = pathname === '/dashboard/login';
  if (isLoginPage) return <>{children}</>;

  // Tampilkan loading saat session sedang dicek
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  // Middleware sudah handle redirect, ini hanya fallback
  if (status === 'unauthenticated') {
    router.push('/dashboard/login');
    return null;
  }

  const username = session?.user?.name || 'Admin';

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard, isActive: pathname === '/dashboard' },
    { label: 'Home', href: '/dashboard/home', Icon: Home, isActive: pathname.startsWith('/dashboard/home') },
    { label: 'About', href: '/dashboard/about', Icon: Heart, isActive: pathname.startsWith('/dashboard/about') },
    { label: 'Memories', href: '/dashboard/memories', Icon: Brain, isActive: pathname.startsWith('/dashboard/memories') },
    { label: 'Gallery', href: '/dashboard/gallery', Icon: Image, isActive: pathname.startsWith('/dashboard/gallery') },
    { label: 'Letters', href: '/dashboard/letters', Icon: Mail, isActive: pathname.startsWith('/dashboard/letters') },
    { label: 'Settings', href: '/dashboard/settings', Icon: Settings, isActive: pathname.startsWith('/dashboard/settings') },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/dashboard/login' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastProvider />
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow border border-slate-200"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-lg transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💜</span>
            <h1 className="text-xl font-bold text-slate-900">My Kasih</h1>
          </div>
          <p className="text-xs text-slate-400 tracking-wider uppercase mt-0.5">Dashboard Admin</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map(({ href, label, Icon, isActive }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700 border border-violet-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 bg-white">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="font-semibold text-slate-900">{username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {children}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
