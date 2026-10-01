import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatValidationError, reservationSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

function kathmanduToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Check the reservation details and try again.', issues: formatValidationError(parsed.error) },
      { status: 400 }
    );
  }

  const { name, phone, email, date, time, guests, message } = parsed.data;
  const dateValue = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(dateValue.getTime()) ||
    dateValue.toISOString().slice(0, 10) !== date ||
    date < kathmanduToday()
  ) {
    return NextResponse.json({ error: 'Choose today or a future date.' }, { status: 400 });
  }

  const reservationInstant = new Date(`${date}T${time}:00+05:45`);
  if (reservationInstant.getTime() < Date.now() + 2 * 60 * 60 * 1000) {
    return NextResponse.json(
      { error: 'Reservations must be made at least two hours in advance.' },
      { status: 400 }
    );
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        customerName: name,
        phone,
        email: email.toLowerCase(),
        date: dateValue,
        time,
        guestCount: guests,
        specialRequest: message || null,
      },
      select: { id: true, status: true, date: true, time: true, guestCount: true },
    });

    return NextResponse.json(
      {
        reservation: {
          ...reservation,
          date: reservation.date.toISOString().slice(0, 10),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation persistence failed:', error);
    return NextResponse.json({ error: 'Unable to save the reservation right now.' }, { status: 503 });
  }
}
