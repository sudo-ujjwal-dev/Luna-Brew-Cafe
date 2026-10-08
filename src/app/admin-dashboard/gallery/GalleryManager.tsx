'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AppImage from '@/components/ui/AppImage';

interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  category: string;
  visible: boolean;
  sortOrder: number;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    altText: '',
    category: 'Interior',
    sortOrder: '0',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadImages(showSkeleton = true) {
    if (showSkeleton) setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/gallery');
      const result = (await response.json()) as { images?: GalleryImage[]; error?: string };
      if (!response.ok || !result.images)
        throw new Error(result.error || 'Unable to load gallery.');
      setImages(result.images);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Gallery data is unavailable.'
      );
    } finally {
      if (showSkeleton) setLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
  }, []);

  async function addImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder), visible: true }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to add this image.');
      setForm({ title: '', imageUrl: '', altText: '', category: 'Interior', sortOrder: '0' });
      setNotice('Gallery image added.');
      await loadImages(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to add this image.');
    } finally {
      setSaving(false);
    }
  }

  async function updateImage(image: GalleryImage, changes: Partial<GalleryImage>) {
    setUpdatingId(image.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/gallery/${image.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to update the image.');
      setNotice('Gallery image updated.');
      await loadImages(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to update the image.'
      );
    } finally {
      setUpdatingId('');
    }
  }

  async function deleteImage(image: GalleryImage) {
    if (!window.confirm(`Delete "${image.title}" from the gallery?`)) return;
    setDeletingId(image.id);
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/gallery/${image.id}`, { method: 'DELETE' });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to delete the image.');
      setNotice('Gallery image deleted.');
      await loadImages(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to delete the image.'
      );
    } finally {
      setDeletingId('');
    }
  }

  return (
    <div className="space-y-6">
      {(error || notice) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`rounded-xl p-4 text-sm ${error ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'}`}
        >
          {error || notice}
        </p>
      )}
      <form
        onSubmit={addImage}
        className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2"
      >
        <h2 className="text-lg font-700 text-foreground md:col-span-2">Add gallery image</h2>
        <div>
          <label htmlFor="gallery-title" className="mb-1 block text-sm font-600 text-foreground">
            Title
          </label>
          <input
            id="gallery-title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
            minLength={2}
            maxLength={120}
            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="gallery-category" className="mb-1 block text-sm font-600 text-foreground">
            Category
          </label>
          <select
            id="gallery-category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
          >
            {['Interior', 'Exterior', 'Food', 'Drinks', 'Staff', 'Events'].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="gallery-url" className="mb-1 block text-sm font-600 text-foreground">
            HTTPS image URL or local path
          </label>
          <input
            id="gallery-url"
            value={form.imageUrl}
            onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
            required
            maxLength={2048}
            placeholder="/images/gallery/interior.webp"
            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="gallery-alt" className="mb-1 block text-sm font-600 text-foreground">
            Alt text
          </label>
          <input
            id="gallery-alt"
            value={form.altText}
            onChange={(event) => setForm({ ...form, altText: event.target.value })}
            required
            minLength={2}
            maxLength={255}
            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="gallery-order" className="mb-1 block text-sm font-600 text-foreground">
            Display order
          </label>
          <input
            id="gallery-order"
            type="number"
            min="0"
            max="10000"
            value={form.sortOrder}
            onChange={(event) => setForm({ ...form, sortOrder: event.target.value })}
            className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="rounded-xl bg-primary px-4 py-3 text-sm font-700 text-primary-foreground disabled:opacity-60 md:col-span-2"
        >
          {saving ? 'Saving…' : 'Add to gallery'}
        </button>
      </form>

      {loading ? (
        <div
          role="status"
          aria-label="Loading gallery"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-48 bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No gallery images yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <article
              key={image.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-48">
                <AppImage
                  src={image.imageUrl}
                  alt={image.altText}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-700 text-foreground">{image.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {image.category} · Order {image.sortOrder} ·{' '}
                    {image.visible ? 'Published' : 'Hidden'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <button
                    type="button"
                    disabled={updatingId === image.id || deletingId === image.id}
                    aria-busy={updatingId === image.id}
                    onClick={() => void updateImage(image, { visible: !image.visible })}
                    className="font-600 text-primary hover:underline disabled:opacity-60"
                  >
                    {updatingId === image.id ? 'Saving…' : image.visible ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === image.id || deletingId === image.id}
                    aria-busy={updatingId === image.id}
                    onClick={() =>
                      void updateImage(image, { sortOrder: Math.max(0, image.sortOrder - 1) })
                    }
                    className="font-600 text-primary hover:underline disabled:opacity-60"
                  >
                    {updatingId === image.id ? 'Saving…' : 'Move earlier'}
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === image.id || deletingId === image.id}
                    aria-busy={deletingId === image.id}
                    onClick={() => void deleteImage(image)}
                    className="font-600 text-danger hover:underline disabled:opacity-60"
                  >
                    {deletingId === image.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
