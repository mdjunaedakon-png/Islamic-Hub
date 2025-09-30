'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EditNewsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    featured: false,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin' && id) {
      loadArticle();
    }
  }, [user, id]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role !== 'admin') router.push('/');
      } else {
        router.push('/auth/login');
      }
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadArticle = async () => {
    try {
      const res = await fetch(`/api/news/${id}`);
      if (res.ok) {
        const data = await res.json();
        const n = data.news;
        setForm({
          title: n.title || '',
          excerpt: n.excerpt || '',
          content: n.content || '',
          image: n.image || '',
          category: n.category || '',
          featured: !!n.featured,
        });
      }
    } catch {
      toast.error('Failed to load article');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Article updated');
        router.push('/dashboard/news');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-primary-600" />
                Edit News
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Update an existing article</p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/news" className="btn-secondary flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
              <button onClick={onSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input name="title" value={form.title} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
            <input name="excerpt" value={form.excerpt} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input name="image" value={form.image} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <input name="category" value={form.category} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Content</label>
            <textarea name="content" rows={8} value={form.content} onChange={onChange} className="input-field" />
          </div>
        </div>
      </div>
    </div>
  );
}


