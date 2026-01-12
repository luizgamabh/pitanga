'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, ApiError } from '../../../../presentation/providers/auth-provider';
import { Button } from '../../../../presentation/components/catalyst/button';
import { Input } from '../../../../presentation/components/catalyst/input';
import { Field, Label } from '../../../../presentation/components/catalyst/fieldset';
import { Heading } from '../../../../presentation/components/catalyst/heading';
import { Text } from '../../../../presentation/components/catalyst/text';
import { Link } from '../../../../presentation/components/catalyst/link';

function TwoFactorVerifyForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { api, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const twoFactorToken = searchParams.get('token');
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!twoFactorToken) {
      setError('Token de autenticação inválido. Faça login novamente.');
      return;
    }

    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.verify2FA({ twoFactorToken, totpCode: code });
      await refreshProfile();
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Código inválido');
      } else {
        setError('Erro ao verificar código. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!twoFactorToken) {
    return (
      <div className="w-full max-w-md text-center">
        <Heading level={2}>Sessão expirada</Heading>
        <Text className="mt-2">
          Sua sessão de login expirou. Por favor, faça login novamente.
        </Text>
        <div className="mt-6">
          <Button href="/login" color="pitanga">
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pitanga-100 dark:bg-pitanga-900/20">
          <svg
            className="h-6 w-6 text-pitanga-600 dark:text-pitanga-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <Heading level={1} className="mt-4">
          Verificação em duas etapas
        </Heading>
        <Text className="mt-2">
          Digite o código de 6 dígitos do seu aplicativo autenticador.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Field>
          <Label>Código de verificação</Label>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            autoComplete="one-time-code"
            placeholder="000000"
            className="text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </Field>

        <Button
          type="submit"
          color="pitanga"
          className="w-full"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Verificando...' : 'Verificar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}

export default function TwoFactorVerifyPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TwoFactorVerifyForm />
    </Suspense>
  );
}
