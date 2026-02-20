'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { simpleAuth } from '@/lib/auth/simple';
import { ToastProvider } from '@/components/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Skip auth check for login page
  const isLoginPage = pathname === '/dashboard/login';

  // Check authentication on mount
  useEffect(() => {
    setMounted(true);
    
    // Skip auth check for login page
    if (isLoginPage) {
      return;
    }
    
    const authenticated = simpleAuth.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      router.push('/dashboard/login');
    } else {
      setUsername(simpleAuth.getUsername());
    }
  }, [router, pathname, isLoginPage]);

  // Show loading only if not mounted and not on login page
  if (!mounted && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Check auth for other dashboard pages
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      isActive: pathname === '/dashboard',
    },
    {
      label: 'Home',
      href: '/dashboard/home',
      icon: '🏠',
      isActive: pathname.startsWith('/dashboard/home'),
    },
    {
      label: 'About',
      href: '/dashboard/about',
      icon: '💜',
      isActive: pathname.startsWith('/dashboard/about'),
    },
    {
      label: 'Memories',
      href: '/dashboard/memories',
      icon: '💭',
      isActive: pathname.startsWith('/dashboard/memories'),
    },
    {
      label: 'Gallery',
      href: '/dashboard/gallery',
      icon: '🖼️',
      isActive: pathname.startsWith('/dashboard/gallery'),
    },
    {
      label: 'Letters',
      href: '/dashboard/letters',
      icon: '💌',
      isActive: pathname.startsWith('/dashboard/letters'),
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: '⚙️',
      isActive: pathname.startsWith('/dashboard/settings'),
    },
  ];

  const handleLogout = () => {
    simpleAuth.logout();
    router.push('/dashboard/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastProvider />
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow border border-slate-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-lg transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">My Kasih</h1>
          <p className="text-sm text-slate-500 mt-1">CMS Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                item.isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
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
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {menuItems.find((item) => item.isActive)?.label || 'Dashboard'}
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          {children}
        </div>
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
