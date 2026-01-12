'use client';

import { useState } from 'react';
import { useAuth, ApiError } from '../../../presentation/providers/auth-provider';
import { Button } from '../../../presentation/components/catalyst/button';
import { Input } from '../../../presentation/components/catalyst/input';
import { Field, Label } from '../../../presentation/components/catalyst/fieldset';
import { Heading } from '../../../presentation/components/catalyst/heading';
import { Text } from '../../../presentation/components/catalyst/text';
import { Link } from '../../../presentation/components/catalyst/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { api } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.auth.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Erro ao enviar email');
      } else {
        setError('Erro ao enviar email. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          Email enviado!
        </Heading>
        <Text className="mt-2">
          Se existe uma conta com o email <strong>{email}</strong>, você receberá um
          link para redefinir sua senha.
        </Text>
        <Text className="mt-4 text-sm text-zinc-500">
          Não recebeu o email? Verifique sua caixa de spam ou{' '}
          <button
            onClick={() => setIsSuccess(false)}
            className="text-pitanga-600 hover:text-pitanga-500 dark:text-pitanga-400"
          >
            tente novamente
          </button>
          .
        </Text>
        <div className="mt-6">
          <Link href="/login" className="text-sm">
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Heading level={1}>Esqueceu sua senha?</Heading>
        <Text className="mt-2">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="seu@email.com"
          />
        </Field>

        <Button
          type="submit"
          color="pitanga"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
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
