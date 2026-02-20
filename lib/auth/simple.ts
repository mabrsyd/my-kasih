/**
 * Simple Authentication Helper
 * Uses sessionStorage for demo purposes
 * No SSR issues, works perfectly with Next.js App Router
 */

const AUTH_KEY = 'dashboard_auth';
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

export const simpleAuth = {
  /**
   * Validate credentials and store session
   */
  login: (username: string, password: string): boolean => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_KEY, 'authenticated');
        sessionStorage.setItem('username', username);
        // Store the token key that all dashboard pages read
        sessionStorage.setItem('dashboard_token', process.env.NEXT_PUBLIC_DASHBOARD_KEY || 'authenticated');
      }
      return true;
    }
    return false;
  },

  /**
   * Clear session
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('dashboard_token');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(AUTH_KEY) === 'authenticated';
  },

  /**
   * Get current username
   */
  getUsername: (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('username');
  },
};

/**
 * Demo credentials for display
 */
export const DEMO_CREDENTIALS = {
  username: DEMO_USERNAME,
  password: DEMO_PASSWORD,
};
