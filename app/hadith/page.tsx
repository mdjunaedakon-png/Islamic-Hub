'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Bookmark, 
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Hadith {
  _id: string;
  collectionName: 'bukhari' | 'muslim' | 'tirmidhi' | 'abu_dawud' | 'nasai' | 'ibn_majah';
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

const collections = [
  { value: '', label: 'All Collections' },
  { value: 'bukhari', label: 'Sahih al-Bukhari' },
  { value: 'muslim', label: 'Sahih Muslim' },
  { value: 'tirmidhi', label: 'Sunan at-Tirmidhi' },
  { value: 'abu_dawud', label: 'Sunan Abu Dawud' },
  { value: 'nasai', label: 'Sunan an-Nasai' },
  { value: 'ibn_majah', label: 'Sunan Ibn Majah' },
];

const collectionColors = {
  bukhari: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  muslim: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  tirmidhi: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  abu_dawud: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  nasai: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  ibn_majah: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

export default function HadithPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHadiths();
  }, [searchTerm, selectedCollection, currentPage]);

  const fetchHadiths = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCollection) params.append('collection', selectedCollection);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', currentPage.toString());
      
      const response = await fetch(`/api/hadith?${params}`);
      if (response.ok) {
        const data = await response.json();
        setHadiths(data.hadiths);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error('Error fetching hadiths');
    } finally {
      setLoading(false);
    }
  };

  const bookmarkHadith = (hadithId: string) => {
    const bookmarks = JSON.parse(localStorage.getItem('hadith-bookmarks') || '[]');
    
    if (!bookmarks.find((b: any) => b === hadithId)) {
      bookmarks.push(hadithId);
      localStorage.setItem('hadith-bookmarks', JSON.stringify(bookmarks));
      toast.success('Hadith bookmarked!');
    } else {
      toast.error('Hadith already bookmarked');
    }
  };

  const shareHadith = (hadith: Hadith) => {
    const text = `${hadith.englishTranslation}\n\n- ${hadith.narrator} (${collections.find(c => c.value === hadith.collectionName)?.label})`;
    
    if (navigator.share) {
      navigator.share({
        title: `Hadith from ${collections.find(c => c.value === hadith.collectionName)?.label}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Hadith copied to clipboard!');
    }
  };

  const getCollectionName = (collection: string) => {
    return collections.find(c => c.value === collection)?.label || collection;
  };

  if (loading && hadiths.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                Hadith Collections
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Authentic sayings and teachings of Prophet Muhammad (PBUH)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 max-w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search hadiths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 sm:pl-10 w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="input-field flex-1 sm:flex-none"
                >
                  {collections.map((collection) => (
                    <option key={collection.value} value={collection.value}>
                      {collection.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hadith List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {hadiths.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {hadiths.map((hadith) => (
              <Link key={hadith._id} href={`/hadith/${hadith._id}`} className="block">
                <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${collectionColors[hadith.collectionName]}`}>
                      {getCollectionName(hadith.collectionName)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      #{hadith.hadithNumber}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        bookmarkHadith(hadith._id);
                      }}
                      className="p-1 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        shareHadith(hadith);
                      }}
                      className="p-1 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="text-right text-lg sm:text-xl leading-relaxed arabic-text text-gray-900 dark:text-white">
                    {hadith.arabicText}
                  </div>
                  
                  <div className="border-l-4 border-primary-200 dark:border-primary-800 pl-3 sm:pl-4">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {hadith.englishTranslation}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-gray-200 dark:border-gray-700 pl-3 sm:pl-4">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {hadith.banglaTranslation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{hadith.book}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{hadith.chapter}</span>
                    </div>
                    <div className="truncate">
                      <span>Narrated by: {hadith.narrator}</span>
                    </div>
                    {hadith.volume && (
                      <div>
                        <span>Vol. {hadith.volume}</span>
                      </div>
                    )}
                    {hadith.page && (
                      <div>
                        <span>Page {hadith.page}</span>
                      </div>
                    )}
                  </div>
                  
                  {hadith.tags.length > 0 && (
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                      {hadith.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hadiths found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              {searchTerm || selectedCollection 
                ? 'Try adjusting your search or filter criteria.'
                : 'No hadiths available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
