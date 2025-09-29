'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Bookmark, Pause, Play, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import BookmarkButton from '@/components/BookmarkButton';

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
  surahNameEnglish: string;
  surahNameArabic: string;
  revelationPlace: 'makkah' | 'madinah' | string;
  totalAyahs: number;
  ayahs: Ayah[];
}

export default function SurahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quran/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSurah(data.quran || data.surah || data); // be tolerant to shape
          setError(null);
        } else if (res.status === 404) {
          setError('Surah not found');
        } else {
          setError('Failed to load surah');
        }
      } catch (e) {
        setError('Failed to load surah');
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const filteredAyahs = useMemo(() => {
    if (!surah) return [] as Ayah[];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return surah.ayahs;
    return surah.ayahs.filter((a) =>
      a.arabicText?.toLowerCase().includes(term) ||
      a.englishTranslation?.toLowerCase().includes(term) ||
      a.banglaTranslation?.toLowerCase().includes(term)
    );
  }, [surah, searchTerm]);

  const playAyah = (ayah: Ayah) => {
    if (!ayah.audioUrl) {
      toast.error('No audio available for this ayah');
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (selectedAyah === ayah.ayahNumber && !audioRef.current.paused) {
      audioRef.current.pause();
      setSelectedAyah(null);
      return;
    }
    audioRef.current.src = ayah.audioUrl;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      toast.error('Unable to play audio');
    });
    setSelectedAyah(ayah.ayahNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">404 - Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Surah not found'}</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="btn-primary">Go Home</Link>
            <button onClick={() => router.back()} className="btn-secondary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ayahs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 w-48 sm:w-64"
                />
              </div>
              <BookmarkButton
                contentType="quran"
                contentId={surah._id}
                contentTitle={`${surah.surahNumber}. ${surah.surahNameEnglish}`}
                contentDescription={`${surah.surahNameArabic} - ${surah.totalAyahs} ayahs`}
                contentUrl={`/quran/${surah._id}`}
                metadata={{ surahNumber: surah.surahNumber, category: surah.revelationPlace }}
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Surah header */}
        <div className="card p-4 sm:p-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {surah.surahNumber}. {surah.surahNameEnglish}
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2 arabic-text">
            {surah.surahNameArabic}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {surah.totalAyahs} ayahs • {surah.revelationPlace === 'makkah' ? 'Makkah' : 'Madinah'}
          </p>
        </div>

        {/* Ayahs */}
        <div className="mt-6 space-y-3 sm:space-y-4">
          {filteredAyahs.map((ayah) => (
            <div key={ayah.ayahNumber} className={`card p-3 sm:p-4 ${selectedAyah === ayah.ayahNumber ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                    {ayah.ayahNumber}
                  </span>
                  <button
                    onClick={() => playAyah(ayah)}
                    className="p-1 sm:p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                  >
                    {selectedAyah === ayah.ayahNumber ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                <button className="p-1 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="text-right text-lg sm:text-xl leading-relaxed arabic-text text-gray-900 dark:text-white">
                  {ayah.arabicText}
                </div>
                <div className="border-l-4 border-primary-200 dark:border-primary-800 pl-3 sm:pl-4">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {ayah.englishTranslation}
                  </p>
                </div>
                <div className="border-l-4 border-gray-200 dark:border-gray-700 pl-3 sm:pl-4">
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {ayah.banglaTranslation}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredAyahs.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No ayahs match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
