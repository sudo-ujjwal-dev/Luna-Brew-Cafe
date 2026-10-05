'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function AccountAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const registering = mode === 'register';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const values = new FormData(event.currentTarget);
    if (registering && values.get('password') !== values.get('confirmPassword')) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/account/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(registering ? { name: values.get('name') } : {}),
          email: values.get('email'),
          password: values.get('password'),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Account request failed.');
      router.replace('/account');
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Account request failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {registering && (
        <div>
          <label htmlFor="customer-name" className="mb-1.5 block text-sm font-600 text-foreground">
            Name
          </label>
          <input
            id="customer-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
          />
        </div>
      )}
      <div>
        <label htmlFor="customer-email" className="mb-1.5 block text-sm font-600 text-foreground">
          Email
        </label>
        <input
          id="customer-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <div>
        <label
          htmlFor="customer-password"
          className="mb-1.5 block text-sm font-600 text-foreground"
        >
          Password
        </label>
        <input
          id="customer-password"
          name="password"
          type="password"
          autoComplete={registering ? 'new-password' : 'current-password'}
          required
          minLength={registering ? 12 : 1}
          maxLength={128}
          className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
        />
        {registering && (
          <p className="mt-1 text-xs text-muted-foreground">Use at least 12 characters.</p>
        )}
      </div>
      {registering && (
        <div>
          <label
            htmlFor="customer-confirm-password"
            className="mb-1.5 block text-sm font-600 text-foreground"
          >
            Confirm password
          </label>
          <input
            id="customer-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
          />
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-primary py-3 text-sm font-700 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Please wait…' : registering ? 'Create Account' : 'Login'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        {registering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          href={registering ? '/account/login' : '/account/register'}
          className="font-600 text-primary hover:underline"
        >
          {registering ? 'Login' : 'Create one'}
        </Link>
      </p>
    </form>
  );
}
