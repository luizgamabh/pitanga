'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth, ApiError } from '../../../presentation/providers/auth-provider';
import { Button } from '../../../presentation/components/catalyst/button';
import { Input } from '../../../presentation/components/catalyst/input';
import { Field, Label } from '../../../presentation/components/catalyst/fieldset';
import { Heading } from '../../../presentation/components/catalyst/heading';
import { Text } from '../../../presentation/components/catalyst/text';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { api } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token inválido. Solicite um novo link de recuperação.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.resetPassword({ token, password });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Erro ao redefinir senha');
      } else {
        setError('Erro ao redefinir senha. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md text-center">
        <Heading level={2}>Link inválido</Heading>
        <Text className="mt-2">
          O link de recuperação é inválido ou expirou.
        </Text>
        <div className="mt-6">
          <Button href="/forgot-password" color="pitanga">
            Solicitar novo link
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
          Senha redefinida!
        </Heading>
        <Text className="mt-2">
          Sua senha foi alterada com sucesso. Você já pode fazer login com sua
          nova senha.
        </Text>
        <div className="mt-6">
          <Button href="/login" color="pitanga">
            Fazer login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Heading level={1}>Redefinir senha</Heading>
        <Text className="mt-2">Digite sua nova senha abaixo.</Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Field>
          <Label>Nova senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <Text className="mt-1 text-xs text-zinc-500">
            Mínimo 8 caracteres, com letra maiúscula, minúscula, número e
            caractere especial
          </Text>
        </Field>

        <Field>
          <Label>Confirmar nova senha</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>

        <Button
          type="submit"
          color="pitanga"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
