'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  BookOpen, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Hadith {
  _id: string;
  collectionName: string;
  hadithNumber: string;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
  narrator: string;
  chapter: string;
  book: string;
  volume?: string;
  page?: string;
  tags: string[];
  createdAt: string;
}

export default function EditHadithPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    collectionName: 'bukhari',
    hadithNumber: '',
    arabicText: '',
    englishTranslation: '',
    banglaTranslation: '',
    narrator: '',
    chapter: '',
    book: '',
    volume: '',
    page: '',
    tags: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin' && id) {
      fetchHadith();
    }
  }, [user, id]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.role !== 'admin') {
          router.push('/');
          toast.error('Admin access required');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchHadith = async () => {
    try {
      const response = await fetch(`/api/hadith/${id}`);
      if (response.ok) {
        const data = await response.json();
        const hadith = data.hadith;
        setFormData({
          collectionName: hadith.collectionName,
          hadithNumber: hadith.hadithNumber,
          arabicText: hadith.arabicText,
          englishTranslation: hadith.englishTranslation,
          banglaTranslation: hadith.banglaTranslation,
          narrator: hadith.narrator,
          chapter: hadith.chapter,
          book: hadith.book,
          volume: hadith.volume || '',
          page: hadith.page || '',
          tags: hadith.tags ? hadith.tags.join(', ') : '',
        });
      } else {
        toast.error('Failed to fetch hadith');
        router.push('/dashboard/hadith');
      }
    } catch (error) {
      console.error('Error fetching hadith:', error);
      toast.error('An error occurred while fetching hadith');
      router.push('/dashboard/hadith');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('📖 Form submission started with data:', formData);

      // Client-side validation
      if (!formData.collectionName.trim()) {
        toast.error('Collection name is required');
        setSaving(false);
        return;
      }
      if (!formData.hadithNumber.trim()) {
        toast.error('Hadith number is required');
        setSaving(false);
        return;
      }
      if (!formData.arabicText.trim()) {
        toast.error('Arabic text is required');
        setSaving(false);
        return;
      }
      if (!formData.englishTranslation.trim()) {
        toast.error('English translation is required');
        setSaving(false);
        return;
      }
      if (!formData.banglaTranslation.trim()) {
        toast.error('Bangla translation is required');
        setSaving(false);
        return;
      }
      if (!formData.narrator.trim()) {
        toast.error('Narrator is required');
        setSaving(false);
        return;
      }
      if (!formData.chapter.trim()) {
        toast.error('Chapter is required');
        setSaving(false);
        return;
      }
      if (!formData.book.trim()) {
        toast.error('Book is required');
        setSaving(false);
        return;
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const requestData = {
        ...formData,
        tags: tagsArray,
      };

      console.log('📖 Sending request data:', requestData);

      const response = await fetch(`/api/hadith/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('📖 API response:', { status: response.status, data });

      if (response.ok) {
        toast.success('Hadith updated successfully!');
        console.log('📖 Hadith updated, redirecting to management page');
        router.push('/dashboard/hadith');
      } else {
        console.error('📖 Hadith update failed:', data);
        toast.error(data.error || 'Failed to update hadith');
      }
    } catch (error) {
      console.error('📖 Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hadith...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Admin access required to edit hadith.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hadith Management
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Edit Hadith
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update hadith with Arabic text, English and Bangla translations
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Collection and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Collection *
                </label>
                <select
                  id="collectionName"
                  name="collectionName"
                  value={formData.collectionName}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="bukhari">Sahih al-Bukhari</option>
                  <option value="muslim">Sahih Muslim</option>
                  <option value="tirmidhi">Jami' at-Tirmidhi</option>
                  <option value="abu_dawud">Sunan Abu Dawud</option>
                  <option value="nasai">Sunan an-Nasai</option>
                  <option value="ibn_majah">Sunan Ibn Majah</option>
                </select>
              </div>

              <div>
                <label htmlFor="hadithNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hadith Number *
                </label>
                <input
                  type="text"
                  id="hadithNumber"
                  name="hadithNumber"
                  value={formData.hadithNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 1, 2, 3..."
                  required
                />
              </div>
            </div>

            {/* Arabic Text */}
            <div>
              <label htmlFor="arabicText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Arabic Text *
              </label>
              <textarea
                id="arabicText"
                name="arabicText"
                value={formData.arabicText}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Enter the Arabic text of the hadith..."
                required
                dir="rtl"
                style={{ textAlign: 'right' }}
              />
            </div>

            {/* English Translation */}
            <div>
              <label htmlFor="englishTranslation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                English Translation *
              </label>
              <textarea
                id="englishTranslation"
                name="englishTranslation"
                value={formData.englishTranslation}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Enter the English translation..."
                required
              />
            </div>

            {/* Bangla Translation */}
            <div>
              <label htmlFor="banglaTranslation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bangla Translation *
              </label>
              <textarea
                id="banglaTranslation"
                name="banglaTranslation"
                value={formData.banglaTranslation}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Enter the Bangla translation..."
                required
              />
            </div>

            {/* Narrator and Chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="narrator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Narrator *
                </label>
                <input
                  type="text"
                  id="narrator"
                  name="narrator"
                  value={formData.narrator}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Abu Bakr, Umar, etc."
                  required
                />
              </div>

              <div>
                <label htmlFor="chapter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter *
                </label>
                <input
                  type="text"
                  id="chapter"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Book of Faith, Book of Prayer"
                  required
                />
              </div>
            </div>

            {/* Book and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="book" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Book *
                </label>
                <input
                  type="text"
                  id="book"
                  name="book"
                  value={formData.book}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Book 1, Book 2"
                  required
                />
              </div>

              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volume
                </label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Volume 1"
                />
              </div>
            </div>

            {/* Page and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="page" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Page
                </label>
                <input
                  type="text"
                  id="page"
                  name="page"
                  value={formData.page}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Page 123"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., faith, prayer, charity (comma separated)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Hadith
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
