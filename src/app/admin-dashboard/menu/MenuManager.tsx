'use client';

import { useEffect, useState, type FormEvent } from 'react';

interface Category {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
  itemCount: number;
}

interface AdminMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: { id: string; name: string };
  image: string | null;
  imageAlt: string | null;
  available: boolean;
  featured: boolean;
  vegetarian: boolean;
  vegan: boolean;
  spicy: boolean;
  preparationTime: number | null;
}

interface MenuManagementResponse {
  categories: Category[];
  items: AdminMenuItem[];
}

const initialForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  image: '',
  imageAlt: '',
  available: true,
  featured: false,
  vegetarian: false,
  vegan: false,
  spicy: false,
  preparationTime: '',
};

export default function MenuManager() {
  const [data, setData] = useState<MenuManagementResponse>({ categories: [], items: [] });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadMenu() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/menu');
      const result = (await response.json()) as MenuManagementResponse & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to load menu management data.');
      setData(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Menu data is unavailable.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMenu();
  }, []);

  function editItem(item: AdminMenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      categoryId: item.categoryId,
      image: item.image ?? '',
      imageAlt: item.imageAlt ?? '',
      available: item.available,
      featured: item.featured,
      vegetarian: item.vegetarian,
      vegan: item.vegan,
      spicy: item.spicy,
      preparationTime: item.preparationTime ? String(item.preparationTime) : '',
    });
    setNotice('');
  }

  async function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const endpoint = editingId ? `/api/admin/menu/${editingId}` : '/api/admin/menu';
    const method = editingId ? 'PATCH' : 'POST';
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          preparationTime: form.preparationTime ? Number(form.preparationTime) : null,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to save this menu item.');
      setForm({
        ...initialForm,
        categoryId: data.categories.find((category) => category.active)?.id ?? '',
      });
      setEditingId(null);
      setNotice(editingId ? 'Menu item updated.' : 'Menu item created.');
      await loadMenu();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to save this menu item.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateItem(item: AdminMenuItem) {
    if (
      !window.confirm(`Mark "${item.name}" unavailable? It will remain in previous order records.`)
    )
      return;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, { method: 'DELETE' });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to deactivate this item.');
      setNotice(`${item.name} marked unavailable.`);
      await loadMenu();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to deactivate this item.'
      );
    }
  }

  async function submitCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      const result = (await response.json()) as { category?: Category; error?: string };
      if (!response.ok || !result.category) {
        throw new Error(result.error || 'Unable to create this category.');
      }
      setNewCategory('');
      setForm((current) => ({ ...current, categoryId: result.category!.id }));
      setNotice('Category created.');
      await loadMenu();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to create this category.'
      );
    }
  }

  async function toggleCategory(category: Category) {
    const nextActive = !category.active;
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextActive }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to update this category.');
      setNotice(nextActive ? 'Category reactivated.' : 'Category deactivated.');
      await loadMenu();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to update this category.'
      );
    }
  }

  const activeCategories = data.categories.filter((category) => category.active);

  return (
    <div className="space-y-8">
      {(error || notice) && (
        <p
          role={error ? 'alert' : 'status'}
          className={`rounded-xl p-4 text-sm ${error ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'}`}
        >
          {error || notice}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <form
          onSubmit={submitItem}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="text-lg font-700 text-foreground">
            {editingId ? 'Edit menu item' : 'Add menu item'}
          </h2>
          <div>
            <label htmlFor="menu-name" className="mb-1.5 block text-sm font-600 text-foreground">
              Name
            </label>
            <input
              id="menu-name"
              required
              minLength={2}
              maxLength={120}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="menu-description"
              className="mb-1.5 block text-sm font-600 text-foreground"
            >
              Description
            </label>
            <textarea
              id="menu-description"
              required
              minLength={5}
              maxLength={5000}
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="menu-price" className="mb-1.5 block text-sm font-600 text-foreground">
                Price (NPR)
              </label>
              <input
                id="menu-price"
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                required
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="menu-category"
                className="mb-1.5 block text-sm font-600 text-foreground"
              >
                Category
              </label>
              <select
                id="menu-category"
                required
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
              >
                <option value="">Select category</option>
                {activeCategories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="menu-image" className="mb-1.5 block text-sm font-600 text-foreground">
              Image URL or local path (optional)
            </label>
            <input
              id="menu-image"
              type="text"
              maxLength={2048}
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              placeholder="/images/menu/coffee.webp"
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="menu-alt" className="mb-1.5 block text-sm font-600 text-foreground">
              Image alt text
            </label>
            <input
              id="menu-alt"
              type="text"
              maxLength={255}
              value={form.imageAlt}
              onChange={(event) => setForm({ ...form, imageAlt: event.target.value })}
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="menu-prep" className="mb-1.5 block text-sm font-600 text-foreground">
              Preparation time (minutes)
            </label>
            <input
              id="menu-prep"
              type="number"
              min="1"
              max="600"
              value={form.preparationTime}
              onChange={(event) => setForm({ ...form, preparationTime: event.target.value })}
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {(
              [
                ['available', 'Available'],
                ['featured', 'Featured'],
                ['vegetarian', 'Vegetarian'],
                ['vegan', 'Vegan'],
                ['spicy', 'Spicy'],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 text-foreground">
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.checked })}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || activeCategories.length === 0}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-700 text-primary-foreground disabled:opacity-60"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create menu item'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
                className="rounded-xl border border-border px-4 py-3 text-sm font-600 text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-700 text-foreground">Categories</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Inactive categories are hidden from the public menu.
              </p>
            </div>
            <form onSubmit={submitCategory} className="flex gap-2">
              <label className="sr-only" htmlFor="new-category">
                New category name
              </label>
              <input
                id="new-category"
                required
                minLength={2}
                maxLength={80}
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="New category"
                className="min-w-0 rounded-xl border border-border bg-input px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-3 py-2 text-sm font-600 text-primary-foreground"
              >
                Add
              </button>
            </form>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {data.categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-600 text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.itemCount} items · {category.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleCategory(category)}
                  className="text-xs font-600 text-primary hover:underline"
                >
                  {category.active ? 'Deactivate' : 'Reactivate'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-700 text-foreground">Menu items</h2>
        </div>
        {loading ? (
          <p role="status" className="p-8 text-center text-sm text-muted-foreground">
            Loading menu items…
          </p>
        ) : data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No menu items have been added.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-600">Item</th>
                  <th className="px-4 py-3 font-600">Category</th>
                  <th className="px-4 py-3 font-600">Price</th>
                  <th className="px-4 py-3 font-600">Status</th>
                  <th className="px-4 py-3 font-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="max-w-xs px-4 py-3">
                      <p className="font-600 text-foreground">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category.name}</td>
                    <td className="px-4 py-3 text-foreground">
                      Rs. {item.price.toLocaleString('en-NP')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.available ? 'Available' : 'Unavailable'}
                      {item.featured ? ' · Featured' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => editItem(item)}
                          className="font-600 text-primary hover:underline"
                        >
                          Edit
                        </button>
                        {item.available && (
                          <button
                            type="button"
                            onClick={() => void deactivateItem(item)}
                            className="font-600 text-danger hover:underline"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
