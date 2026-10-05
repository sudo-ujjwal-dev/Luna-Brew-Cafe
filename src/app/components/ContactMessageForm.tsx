'use client';

import { useState, type FormEvent } from 'react';

export default function ContactMessageForm() {
  const [error, setError] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessageSent(false);
    setEmailSent(null);
    setSubmitting(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          subject: form.get('subject'),
          message: form.get('message'),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        emailSent?: boolean;
        emailStatus?: string;
      };
      if (!response.ok) throw new Error(result.error || 'Unable to save your message.');
      formElement.reset();
      setMessageSent(true);
      setEmailSent(result.emailSent === true);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to save your message.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submitMessage}
      className="space-y-4 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <h3 className="font-700 text-foreground">Send a message</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Message the café team at lumlelyujjwal@gmail.com.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-600 text-foreground">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-600 text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-600 text-foreground">
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={25}
            autoComplete="tel"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="contact-subject"
            className="mb-1.5 block text-sm font-600 text-foreground"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            required
            minLength={3}
            maxLength={160}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-sm font-600 text-foreground"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm"
          />
        </div>
      </div>
      {(error || messageSent) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`text-sm ${error ? 'text-danger' : 'text-success'}`}
        >
          {error ||
            (emailSent
              ? 'Your message was saved and emailed to the café team.'
              : 'Your message was saved in the admin inbox, but email delivery is not configured or is currently unavailable.')}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-700 text-primary-foreground disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
