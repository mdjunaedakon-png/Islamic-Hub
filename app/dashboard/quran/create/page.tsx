'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Save, 
  ArrowLeft, 
  Plus,
  X,
  AlertCircle,
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

export default function CreateQuranPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    surahNumber: '',
    surahName: '',
    surahNameArabic: '',
    surahNameEnglish: '',
    totalAyahs: '',
    revelationPlace: 'makkah',
  });
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

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
    setCreating(true);

    try {
      console.log('📖 Form submission started with data:', formData);

      // Client-side validation
      if (!formData.surahNumber.trim()) {
        toast.error('Surah number is required');
        setCreating(false);
        return;
      }
      if (!formData.surahName.trim()) {
        toast.error('Surah name is required');
        setCreating(false);
        return;
      }
      if (!formData.surahNameArabic.trim()) {
        toast.error('Arabic surah name is required');
        setCreating(false);
        return;
      }
      if (!formData.surahNameEnglish.trim()) {
        toast.error('English surah name is required');
        setCreating(false);
        return;
      }
      if (!formData.totalAyahs.trim()) {
        toast.error('Total ayahs is required');
        setCreating(false);
        return;
      }
      if (ayahs.length === 0) {
        toast.error('At least one ayah is required');
        setCreating(false);
        return;
      }

      // Validate ayahs
      for (let i = 0; i < ayahs.length; i++) {
        const ayah = ayahs[i];
        if (!ayah.arabicText.trim()) {
          toast.error(`Arabic text is required for ayah ${i + 1}`);
          setCreating(false);
          return;
        }
        if (!ayah.englishTranslation.trim()) {
          toast.error(`English translation is required for ayah ${i + 1}`);
          setCreating(false);
          return;
        }
        if (!ayah.banglaTranslation.trim()) {
          toast.error(`Bangla translation is required for ayah ${i + 1}`);
          setCreating(false);
          return;
        }
      }

      const requestData = {
        ...formData,
        surahNumber: parseInt(formData.surahNumber),
        totalAyahs: parseInt(formData.totalAyahs),
        ayahs: ayahs.map(ayah => ({
          ...ayah,
          ayahNumber: parseInt(ayah.ayahNumber.toString()),
        })),
      };

      console.log('📖 Sending request data:', requestData);

      const response = await fetch('/api/quran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('📖 API response:', { status: response.status, data });

      if (response.ok) {
        toast.success('Surah created successfully!');
        console.log('📖 Surah created, redirecting to dashboard');
        router.push('/dashboard/quran');
      } else {
        console.error('📖 Surah creation failed:', data);
        toast.error(data.error || 'Failed to create surah');
      }
    } catch (error) {
      console.error('📖 Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Admin access required to create surah.</p>
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
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            Add New Surah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add a new surah with Arabic text, English and Bangla translations
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Surah Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="surahNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Surah Number *
                </label>
                <input
                  type="number"
                  id="surahNumber"
                  name="surahNumber"
                  value={formData.surahNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 1, 2, 3..."
                  min="1"
                  max="114"
                  required
                />
              </div>

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
                disabled={creating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Surah
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
