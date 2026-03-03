/**
 * Auth.js v5 (NextAuth) Configuration
 * Best Practice: Server-side session management dengan Credentials Provider
 */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminUsername || !adminPassword) {
          console.error('[AUTH] ADMIN_USERNAME / ADMIN_PASSWORD belum dikonfigurasi di .env');
          return null;
        }

        // Validasi kredensial
        const isValidUsername = username === adminUsername;
        const isValidPassword = password === adminPassword;

        if (!isValidUsername || !isValidPassword) {
          return null;
        }

        // Return user object yang akan disimpan dalam session/token
        return {
          id: 'admin',
          name: adminUsername,
          role: 'admin',
        };
      },
    }),
  ],

  // Pakai JWT strategy (stateless, tidak perlu DB untuk session)
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 24 jam
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/dashboard/login',
    error: '/dashboard/login',
  },

  // Aktifkan debug hanya di development
  debug: process.env.NODE_ENV === 'development',
});
