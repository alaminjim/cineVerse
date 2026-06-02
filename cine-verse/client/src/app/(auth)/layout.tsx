"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No automatic redirects - let users access login/register pages freely
  // Auth state is managed in the components themselves
  return <>{children}</>;
}
