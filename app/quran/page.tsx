'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Bookmark, 
  Search,
  ChevronLeft,
  ChevronRight,
  List
} from 'lucide-react';
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
  surahName: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahs: Ayah[];
  totalAyahs: number;
  revelationPlace: 'makkah' | 'madinah';
}

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSurahList, setShowSurahList] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      console.log('Fetching all surahs...');
      const response = await fetch('/api/quran');
      console.log('Surahs API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Surahs data received:', data);
        setSurahs(data.surahs);
      } else {
        const errorData = await response.json();
        console.error('Error fetching surahs:', errorData);
        toast.error(errorData.error || 'Error fetching Quran data');
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
      toast.error('Error fetching Quran data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSurah = async (surahNumber: number) => {
    try {
      console.log('Fetching surah number:', surahNumber);
      const response = await fetch(`/api/quran?surah=${surahNumber}`);
      console.log('Surah API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Surah data received:', data);
        setSelectedSurah(data.surah);
        setSelectedAyah(1);
      } else {
        const errorData = await response.json();
        console.error('Error fetching surah:', errorData);
        toast.error(errorData.error || 'Error fetching surah');
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
      toast.error('Error fetching surah');
    }
  };

  const playAyah = (ayah: Ayah) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (ayah.audioUrl) {
      const audio = new Audio(ayah.audioUrl);
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
    } else {
      toast.error('Audio not available for this ayah');
    }
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const bookmarkAyah = (surahNumber: number, ayahNumber: number) => {
    // In a real app, this would save to the database
    const bookmarks = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]');
    const bookmark = { surahNumber, ayahNumber, timestamp: new Date() };
    
    if (!bookmarks.find((b: any) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)) {
      bookmarks.push(bookmark);
      localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
      toast.success('Ayah bookmarked!');
    } else {
      toast.error('Ayah already bookmarked');
    }
  };

  const filteredSurahs = surahs.filter(surah =>
    surah.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.surahNameArabic.includes(searchTerm) ||
    surah.surahNameEnglish.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
                Holy Quran
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Read, listen, and reflect on the words of Allah
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search surahs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-64"
                />
              </div>
              
              <button
                onClick={() => setShowSurahList(!showSurahList)}
                className="btn-secondary flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                Surah List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Surah List Sidebar */}
          <div className={`lg:col-span-1 ${showSurahList ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Surahs ({filteredSurahs.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah._id}
                    onClick={() => {
                      fetchSurah(surah.surahNumber);
                      setShowSurahList(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSurah?.surahNumber === surah.surahNumber
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">
                          {surah.surahNumber}. {surah.surahNameEnglish}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {surah.surahNameArabic}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {surah.totalAyahs} ayahs
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSurah ? (
              <div className="space-y-6">
                {/* Surah Header */}
                <div className="card p-6 text-center">
                  <div className="flex items-center justify-between mb-4">
                    <div></div>
                    <div className="flex items-center gap-2">
                      <BookmarkButton
                        contentType="quran"
                        contentId={selectedSurah._id}
                        contentTitle={`${selectedSurah.surahNumber}. ${selectedSurah.surahNameEnglish}`}
                        contentDescription={`${selectedSurah.surahNameArabic} - ${selectedSurah.totalAyahs} ayahs`}
                        contentUrl={`/quran/${selectedSurah._id}`}
                        metadata={{
                          surahNumber: selectedSurah.surahNumber,
                          category: selectedSurah.revelationPlace,
                        }}
                        size="md"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedSurah.surahNumber}. {selectedSurah.surahNameEnglish}
                  </h2>
                  <h3 className="text-3xl font-bold text-primary-600 mb-2 arabic-text">
                    {selectedSurah.surahNameArabic}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedSurah.totalAyahs} ayahs • 
                    {selectedSurah.revelationPlace === 'makkah' ? ' Makkah' : ' Madinah'}
                  </p>
                </div>

                {/* Ayahs */}
                <div className="space-y-4">
                  {selectedSurah.ayahs.map((ayah) => (
                    <div
                      key={ayah.ayahNumber}
                      className={`card p-6 ${
                        selectedAyah === ayah.ayahNumber ? 'ring-2 ring-primary-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                            {ayah.ayahNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => playAyah(ayah)}
                              className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                            >
                              {isPlaying && selectedAyah === ayah.ayahNumber ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => pauseAudio()}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => bookmarkAyah(selectedSurah.surahNumber, ayah.ayahNumber)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="text-right text-2xl leading-relaxed arabic-text text-gray-900 dark:text-white">
                          {ayah.arabicText}
                        </div>
                        
                        <div className="border-l-4 border-primary-200 dark:border-primary-800 pl-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {ayah.englishTranslation}
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {ayah.banglaTranslation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const prevSurah = surahs.find(s => s.surahNumber === selectedSurah.surahNumber - 1);
                      if (prevSurah) {
                        fetchSurah(prevSurah.surahNumber);
                      }
                    }}
                    disabled={selectedSurah.surahNumber === 1}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous Surah
                  </button>
                  
                  <button
                    onClick={() => {
                      const nextSurah = surahs.find(s => s.surahNumber === selectedSurah.surahNumber + 1);
                      if (nextSurah) {
                        fetchSurah(nextSurah.surahNumber);
                      }
                    }}
                    disabled={selectedSurah.surahNumber === 114}
                    className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Surah
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Surah to begin
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a surah from the list to start reading the Holy Quran
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
