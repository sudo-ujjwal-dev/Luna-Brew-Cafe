import 'server-only';

import nodemailer from 'nodemailer';

interface ContactNotification {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(message: ContactNotification) {
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL?.trim();
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;

  if (
    !adminEmail ||
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !user ||
    !password
  ) {
    return { sent: false as const, reason: 'not_configured' as const };
  }

  let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;
  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user, pass: password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transporter.sendMail({
      from: user,
      to: adminEmail,
      replyTo: message.email,
      subject: `Luna Brew Café contact: ${message.subject}`,
      text: [
        `Name: ${message.name}`,
        `Email: ${message.email}`,
        '',
        'Message:',
        message.message,
      ].join('\n'),
    });
    return { sent: true as const };
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message.replaceAll(password, '[redacted]').replaceAll(user, '[redacted]')
        : 'Unknown SMTP error';
    console.error('Contact email delivery failed:', detail);
    return { sent: false as const, reason: 'delivery_failed' as const };
  } finally {
    transporter?.close();
  }
}
