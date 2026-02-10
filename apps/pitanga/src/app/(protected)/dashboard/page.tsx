'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../store';
import { Button } from '../../../presentation/components/catalyst/button';
import { Heading } from '../../../presentation/components/catalyst/heading';
import { Text } from '../../../presentation/components/catalyst/text';

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      {dark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}

export default function DashboardPage() {
  const { user, profile, logout } = useAuth();

  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-900">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Heading level={1} className="text-xl">
            Pitanga
          </Heading>
          <div className="flex items-center gap-4">
            <Text className="text-sm text-zinc-600 dark:text-zinc-400">
              {user?.email}
            </Text>
            <ThemeToggle />
            <Button onClick={logout} outline>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-950">
          <Heading level={2}>
            Bem-vindo{profile?.name ? `, ${profile.name}` : ''}!
          </Heading>
          <Text className="mt-2">Você está logado com sucesso.</Text>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </Text>
              <Text className="mt-1 font-semibold">{profile?.email}</Text>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Email verificado
              </Text>
              <Text className="mt-1 font-semibold">
                {profile?.emailVerified ? 'Sim' : 'Não'}
              </Text>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                2FA
              </Text>
              <Text className="mt-1 font-semibold">
                {profile?.twoFactorEnabled ? 'Ativado' : 'Desativado'}
              </Text>
            </div>
          </div>

          {!profile?.twoFactorEnabled && (
            <div className="mt-6">
              <Button href="/2fa/setup" color="pitanga">
                Ativar autenticação em duas etapas
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
