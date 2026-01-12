'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ApiError } from '../../../../presentation/providers/auth-provider';
import { Button } from '../../../../presentation/components/catalyst/button';
import { Input } from '../../../../presentation/components/catalyst/input';
import { Field, Label } from '../../../../presentation/components/catalyst/fieldset';
import { Heading } from '../../../../presentation/components/catalyst/heading';
import { Text } from '../../../../presentation/components/catalyst/text';
import type { ITwoFactorSetup } from '@pitanga/auth-types';

export default function TwoFactorSetupPage() {
  const [setup, setSetup] = useState<ITwoFactorSetup | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const { api, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const generateSetup = async () => {
      try {
        const result = await api.auth.generate2FASetup();
        setSetup(result);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || 'Erro ao gerar configuração 2FA');
        } else {
          setError('Erro ao gerar configuração. Tente novamente.');
        }
      } finally {
        setIsGenerating(false);
      }
    };

    generateSetup();
  }, [api.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!setup) {
      setError('Configuração não carregada. Recarregue a página.');
      return;
    }

    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.enable2FA({ secret: setup.secret, totpCode: code });
      await refreshProfile();
      router.push('/dashboard?2fa=enabled');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Código inválido');
      } else {
        setError('Erro ao ativar 2FA. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center">
          <svg
            className="h-8 w-8 animate-spin text-pitanga-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <Heading level={2} className="mt-4">
          Gerando configuração...
        </Heading>
      </div>
    );
  }

  if (error && !setup) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <Heading level={2} className="mt-4">
          Erro
        </Heading>
        <Text className="mt-2">{error}</Text>
        <div className="mt-6">
          <Button href="/dashboard" outline>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Heading level={1}>Ativar 2FA</Heading>
        <Text className="mt-2">
          Escaneie o código QR abaixo com seu aplicativo autenticador (Google
          Authenticator, Authy, etc.)
        </Text>
      </div>

      {setup && (
        <div className="mb-8">
          <div className="flex justify-center">
            <img
              src={setup.qrCode}
              alt="QR Code para 2FA"
              className="h-48 w-48 rounded-lg border border-zinc-200 dark:border-zinc-700"
            />
          </div>
          <Text className="mt-4 text-center text-sm text-zinc-500">
            Ou digite manualmente:
          </Text>
          <div className="mt-2 rounded-lg bg-zinc-100 p-3 text-center font-mono text-sm dark:bg-zinc-800">
            {setup.secret}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && setup && (
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
          <Text className="mt-1 text-xs text-zinc-500">
            Digite o código de 6 dígitos do seu aplicativo
          </Text>
        </Field>

        <Button
          type="submit"
          color="pitanga"
          className="w-full"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Ativando...' : 'Ativar 2FA'}
        </Button>

        <Button href="/dashboard" outline className="w-full">
          Cancelar
        </Button>
      </form>
    </div>
  );
}
