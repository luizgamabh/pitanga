'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createApiClient, ApiClient, ApiError } from '@pitanga/api-client';
import type { IAuthUser, IUserProfile } from '@pitanga/auth-types';

interface AuthContextType {
  user: IAuthUser | null;
  profile: IUserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  api: ApiClient;
  login: (email: string, password: string) => Promise<{ requiresTwoFactor?: boolean; twoFactorToken?: string }>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/2fa/verify',
  '/auth/callback',
  '/',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const api = createApiClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
    getAccessToken: () => accessToken,
    onTokenRefresh: (tokens) => {
      setAccessToken(tokens.accessToken);
    },
    onAuthError: () => {
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      router.push('/login');
    },
  });

  const refreshProfile = useCallback(async () => {
    try {
      const userProfile = await api.auth.getProfile();
      setProfile(userProfile);
      setUser({
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        emailVerified: userProfile.emailVerified,
        twoFactorEnabled: userProfile.twoFactorEnabled,
      });
    } catch {
      // Session expired or invalid
      setUser(null);
      setProfile(null);
    }
  }, [api.auth]);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await api.auth.getSession();
        setUser(session);
        await refreshProfile();
      } catch {
        // Not authenticated
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith('/auth/')
    );

    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ requiresTwoFactor?: boolean; twoFactorToken?: string }> => {
    const result = await api.auth.login({ email, password });

    if (result.requiresTwoFactor) {
      return {
        requiresTwoFactor: true,
        twoFactorToken: result.twoFactorToken,
      };
    }

    if (result.accessToken) {
      setAccessToken(result.accessToken);
    }

    if (result.user) {
      setUser(result.user);
      await refreshProfile();
    }

    return {};
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    const result = await api.auth.register({ email, password, name });
    setAccessToken(result.accessToken);
    setUser(result.user);
    router.push('/verify-email?pending=true');
  };

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        api,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ApiError };
