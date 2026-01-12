'use client';

import { useAuth } from '../../../presentation/providers/auth-provider';
import { Button } from '../../../presentation/components/catalyst/button';
import { Heading } from '../../../presentation/components/catalyst/heading';
import { Text } from '../../../presentation/components/catalyst/text';

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
          <Text className="mt-2">
            Você está logado com sucesso.
          </Text>

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
