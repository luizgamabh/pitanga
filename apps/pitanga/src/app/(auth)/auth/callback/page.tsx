'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../presentation/providers/auth-provider';
import { Heading } from '../../../../presentation/components/catalyst/heading';
import { Text } from '../../../../presentation/components/catalyst/text';
import { Button } from '../../../../presentation/components/catalyst/button';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile } = useAuth();

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');
  const isNewUser = searchParams.get('isNewUser') === 'true';

  useEffect(() => {
    if (success) {
      // Refresh the profile to get the latest user data
      refreshProfile().then(() => {
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      });
    }
  }, [success, refreshProfile, router]);

  if (success) {
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
          {isNewUser ? 'Conta criada!' : 'Login realizado!'}
        </Heading>
        <Text className="mt-2">
          {isNewUser
            ? 'Sua conta foi criada com sucesso. Redirecionando...'
            : 'Login realizado com sucesso. Redirecionando...'}
        </Text>
        <div className="mt-4">
          <svg
            className="mx-auto h-6 w-6 animate-spin text-pitanga-500"
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
      </div>
    );
  }

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
        Erro no login
      </Heading>
      <Text className="mt-2">
        {error || 'Ocorreu um erro ao fazer login. Tente novamente.'}
      </Text>
      <div className="mt-6 space-y-3">
        <Button href="/login" color="pitanga" className="w-full">
          Voltar para o login
        </Button>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
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
            Processando...
          </Heading>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
