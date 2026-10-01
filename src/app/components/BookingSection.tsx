'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, Users, Clock } from 'lucide-react';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

const timeSlots = [
  'slot-0800',
  'slot-0900',
  'slot-1000',
  'slot-1100',
  'slot-1200',
  'slot-1300',
  'slot-1400',
  'slot-1500',
  'slot-1600',
  'slot-1700',
  'slot-1800',
  'slot-1900',
].map((id) => {
  const hour = parseInt(id.replace('slot-', '').slice(0, 2));
  const min = id.replace('slot-', '').slice(2);
  const h = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  return { id, label: `${h}:${min} ${period}` };
});

export default function BookingSection() {
  const [submissionError, setSubmissionError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>();

  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const onSubmit = () => {
    setSubmissionError(
      'This portfolio demo does not save reservation requests yet. No booking has been made.'
    );
  };

  return (
    <section id="booking" className="py-20 bg-foreground">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left content */}
          <div className="text-white">
            <p className="text-accent text-xs font-600 uppercase tracking-widest mb-3">
              Reservations
            </p>
            <h2 className="text-display font-700 text-white mb-4">Reserve Your Table</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              This fictional café concept is set in Lakeside, Pokhara. Its reservation service is
              not connected to a booking system, so submissions are not accepted.
            </p>

            <div className="space-y-4">
              {[
                {
                  Icon: CalendarDays,
                  title: 'Choose a date',
                  desc: 'The booking flow is a visual preview only',
                },
                {
                  Icon: Users,
                  title: 'Plan your visit',
                  desc: 'Guest details are not stored by this demo',
                },
                {
                  Icon: Clock,
                  title: 'No confirmation is sent',
                  desc: 'A live reservation service still needs to be configured',
                },
              ].map(({ Icon, title, desc }) => (
                <div key={`booking-feature-${title}`} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-600 text-white text-sm">{title}</p>
                    <p className="text-white/50 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <h3 className="text-lg font-700 text-foreground mb-1">Book a Table</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Preview form only. Requests are not saved.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-sm font-600 text-foreground mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    placeholder="Maya Chen"
                    className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                      errors.name ? 'border-danger' : 'border-border'
                    }`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-sm font-600 text-foreground mb-1.5"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    placeholder="+977 98X XXX XXXX"
                    className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                      errors.phone ? 'border-danger' : 'border-border'
                    }`}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-danger mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  className="block text-sm font-600 text-foreground mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  placeholder="you@email.com"
                  className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                    errors.email ? 'border-danger' : 'border-border'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-sm font-600 text-foreground mb-1.5"
                  >
                    Date *
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                      errors.date ? 'border-danger' : 'border-border'
                    }`}
                    min={minimumDate}
                    {...register('date', {
                      required: 'Date is required',
                      min: { value: minimumDate, message: 'Choose today or a future date' },
                    })}
                  />
                  {errors.date && <p className="text-xs text-danger mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label
                    htmlFor="booking-time"
                    className="block text-sm font-600 text-foreground mb-1.5"
                  >
                    Time *
                  </label>
                  <select
                    id="booking-time"
                    className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                      errors.time ? 'border-danger' : 'border-border'
                    }`}
                    {...register('time', { required: 'Time is required' })}
                  >
                    <option value="">Select</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  {errors.time && <p className="text-xs text-danger mt-1">{errors.time.message}</p>}
                </div>

                <div>
                  <label
                    htmlFor="booking-guests"
                    className="block text-sm font-600 text-foreground mb-1.5"
                  >
                    Guests *
                  </label>
                  <select
                    id="booking-guests"
                    className={`w-full bg-input border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all ${
                      errors.guests ? 'border-danger' : 'border-border'
                    }`}
                    {...register('guests', { required: 'Guest count is required' })}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={`guest-${n}`} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                  {errors.guests && (
                    <p className="text-xs text-danger mt-1">{errors.guests.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-message"
                  className="block text-sm font-600 text-foreground mb-1.5"
                >
                  Special Requests
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Dietary needs, occasion, seating preferences
                </p>
                <textarea
                  id="booking-message"
                  rows={3}
                  placeholder="e.g. Birthday celebration, window seat preferred, nut allergy"
                  className="w-full bg-input border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  {...register('message')}
                />
              </div>

              {submissionError && (
                <p role="alert" className="text-sm text-danger">
                  {submissionError}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-700 py-3.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Preview Reservation Form
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
