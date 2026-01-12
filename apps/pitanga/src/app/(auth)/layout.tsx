import { AuthLayout } from '../../presentation/components/catalyst/auth-layout';

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
