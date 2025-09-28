'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  BookOpen, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Loader,
  Plus,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Ayah {
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
  audioUrl?: string;
}

interface Surah {
  _id: string;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  totalAyahs: number;
  revelationPlace: 'makkah' | 'madinah';
  ayahs: Ayah[];
  createdAt: string;
}

export default function EditQuranPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    surahName: '',
    surahNameArabic: '',
    surahNameEnglish: '',
    totalAyahs: '',
    revelationPlace: 'makkah',
  });
  const [ayahs, setAyahs] = useState<Ayah[]>([]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin' && id) {
      fetchSurah();
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

  const fetchSurah = async () => {
    try {
      const response = await fetch(`/api/quran/${id}`);
      if (response.ok) {
        const data = await response.json();
        const surah = data.surah;
        setFormData({
          surahName: surah.surahName,
          surahNameArabic: surah.surahNameArabic,
          surahNameEnglish: surah.surahNameEnglish,
          totalAyahs: surah.totalAyahs.toString(),
          revelationPlace: surah.revelationPlace,
        });
        setAyahs(surah.ayahs || []);
      } else {
        toast.error('Failed to fetch surah');
        router.push('/dashboard/quran');
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
      toast.error('An error occurred while fetching surah');
      router.push('/dashboard/quran');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addAyah = () => {
    const newAyahNumber = ayahs.length + 1;
    setAyahs([...ayahs, {
      ayahNumber: newAyahNumber,
      arabicText: '',
      englishTranslation: '',
      banglaTranslation: '',
      audioUrl: '',
    }]);
  };

  const removeAyah = (index: number) => {
    const newAyahs = ayahs.filter((_, i) => i !== index);
    // Renumber ayahs
    const renumberedAyahs = newAyahs.map((ayah, i) => ({
      ...ayah,
      ayahNumber: i + 1,
    }));
    setAyahs(renumberedAyahs);
  };

  const updateAyah = (index: number, field: keyof Ayah, value: string | number) => {
    const newAyahs = [...ayahs];
    newAyahs[index] = {
      ...newAyahs[index],
      [field]: value,
    };
    setAyahs(newAyahs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('📖 Form submission started with data:', formData);

      // Client-side validation
      if (!formData.surahName.trim()) {
        toast.error('Surah name is required');
        setSaving(false);
        return;
      }
      if (!formData.surahNameArabic.trim()) {
        toast.error('Arabic surah name is required');
        setSaving(false);
        return;
      }
      if (!formData.surahNameEnglish.trim()) {
        toast.error('English surah name is required');
        setSaving(false);
        return;
      }
      if (!formData.totalAyahs.trim()) {
        toast.error('Total ayahs is required');
        setSaving(false);
        return;
      }
      if (ayahs.length === 0) {
        toast.error('At least one ayah is required');
        setSaving(false);
        return;
      }

      // Validate ayahs
      for (let i = 0; i < ayahs.length; i++) {
        const ayah = ayahs[i];
        if (!ayah.arabicText.trim()) {
          toast.error(`Arabic text is required for ayah ${i + 1}`);
          setSaving(false);
          return;
        }
        if (!ayah.englishTranslation.trim()) {
          toast.error(`English translation is required for ayah ${i + 1}`);
          setSaving(false);
          return;
        }
        if (!ayah.banglaTranslation.trim()) {
          toast.error(`Bangla translation is required for ayah ${i + 1}`);
          setSaving(false);
          return;
        }
      }

      const requestData = {
        ...formData,
        totalAyahs: parseInt(formData.totalAyahs),
        ayahs: ayahs.map(ayah => ({
          ...ayah,
          ayahNumber: parseInt(ayah.ayahNumber.toString()),
        })),
      };

      console.log('📖 Sending request data:', requestData);

      const response = await fetch(`/api/quran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('📖 API response:', { status: response.status, data });

      if (response.ok) {
        toast.success('Surah updated successfully!');
        console.log('📖 Surah updated, redirecting to management page');
        router.push('/dashboard/quran');
      } else {
        console.error('📖 Surah update failed:', data);
        toast.error(data.error || 'Failed to update surah');
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
          <p className="text-gray-600 dark:text-gray-400">Loading surah...</p>
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
          <p className="text-gray-600 dark:text-gray-400">Admin access required to edit surah.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quran Management
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Edit Surah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update surah with Arabic text, English and Bangla translations
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Surah Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="surahName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surah Name (English) *
                </label>
                <input
                  type="text"
                  id="surahName"
                  name="surahName"
                  value={formData.surahName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Al-Fatihah"
                  required
                />
              </div>

              <div>
                <label htmlFor="surahNameArabic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surah Name (Arabic) *
                </label>
                <input
                  type="text"
                  id="surahNameArabic"
                  name="surahNameArabic"
                  value={formData.surahNameArabic}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., الفاتحة"
                  required
                  dir="rtl"
                />
              </div>

              <div>
                <label htmlFor="surahNameEnglish" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surah Name (English) *
                </label>
                <input
                  type="text"
                  id="surahNameEnglish"
                  name="surahNameEnglish"
                  value={formData.surahNameEnglish}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., The Opening"
                  required
                />
              </div>

              <div>
                <label htmlFor="totalAyahs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Ayahs *
                </label>
                <input
                  type="number"
                  id="totalAyahs"
                  name="totalAyahs"
                  value={formData.totalAyahs}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 7"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="revelationPlace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Revelation Place *
                </label>
                <select
                  id="revelationPlace"
                  name="revelationPlace"
                  value={formData.revelationPlace}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="makkah">Makkah</option>
                  <option value="madinah">Madinah</option>
                </select>
              </div>
            </div>

            {/* Ayahs Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ayahs ({ayahs.length})
                </h2>
                <button
                  type="button"
                  onClick={addAyah}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Ayah
                </button>
              </div>

              <div className="space-y-4">
                {ayahs.map((ayah, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Ayah {ayah.ayahNumber}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeAyah(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Arabic Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Arabic Text *
                        </label>
                        <textarea
                          value={ayah.arabicText}
                          onChange={(e) => updateAyah(index, 'arabicText', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Enter Arabic text..."
                          required
                          dir="rtl"
                          style={{ textAlign: 'right' }}
                        />
                      </div>

                      {/* English Translation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          English Translation *
                        </label>
                        <textarea
                          value={ayah.englishTranslation}
                          onChange={(e) => updateAyah(index, 'englishTranslation', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Enter English translation..."
                          required
                        />
                      </div>

                      {/* Bangla Translation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bangla Translation *
                        </label>
                        <textarea
                          value={ayah.banglaTranslation}
                          onChange={(e) => updateAyah(index, 'banglaTranslation', e.target.value)}
                          className="input-field"
                          rows={3}
                          placeholder="Enter Bangla translation..."
                          required
                        />
                      </div>

                      {/* Audio URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Audio URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={ayah.audioUrl || ''}
                          onChange={(e) => updateAyah(index, 'audioUrl', e.target.value)}
                          className="input-field"
                          placeholder="https://example.com/audio.mp3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                    Update Surah
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
