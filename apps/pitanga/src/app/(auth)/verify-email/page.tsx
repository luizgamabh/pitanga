'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth, ApiError } from '../../../presentation/providers/auth-provider';
import { Button } from '../../../presentation/components/catalyst/button';
import { Heading } from '../../../presentation/components/catalyst/heading';
import { Text } from '../../../presentation/components/catalyst/text';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { api } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      setStatus('verifying');
      try {
        await api.auth.verifyEmail({ token });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        if (err instanceof ApiError) {
          setError(err.message || 'Token inválido ou expirado');
        } else {
          setError('Erro ao verificar email. Tente novamente.');
        }
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, api.auth]);

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await api.auth.resendVerificationEmail();
      setError('');
      alert('Email de verificação enviado!');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Erro ao reenviar email');
      } else {
        setError('Erro ao reenviar email. Tente novamente.');
      }
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'verifying') {
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
          Verificando...
        </Heading>
        <Text className="mt-2">Aguarde enquanto verificamos seu email.</Text>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <Heading level={2} className="mt-4">
          Email verificado!
        </Heading>
        <Text className="mt-2">
          Sua conta foi verificada com sucesso. Você já pode acessar todas as
          funcionalidades.
        </Text>
        <div className="mt-6">
          <Button href="/dashboard" color="pitanga">
            Ir para o Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'error' || error) {
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
          Erro na verificação
        </Heading>
        <Text className="mt-2">{error}</Text>
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleResend}
            color="pitanga"
            className="w-full"
            disabled={isResending}
          >
            {isResending ? 'Enviando...' : 'Reenviar email de verificação'}
          </Button>
          <Button href="/login" outline className="w-full">
            Voltar para o login
          </Button>
        </div>
      </div>
    );
  }

  // Pending state (after registration)
  return (
    <div className="w-full max-w-md text-center">
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <Heading level={2} className="mt-4">
        Verifique seu email
      </Heading>
      <Text className="mt-2">
        Enviamos um link de verificação para seu email. Clique no link para
        ativar sua conta.
      </Text>
      <Text className="mt-4 text-sm text-zinc-500">
        Não recebeu o email? Verifique sua caixa de spam ou
      </Text>
      <div className="mt-4">
        <Button
          onClick={handleResend}
          outline
          disabled={isResending}
        >
          {isResending ? 'Enviando...' : 'Reenviar email'}
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
