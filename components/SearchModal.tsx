'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, MessageSquare, Newspaper, ShoppingBag, Video, Keyboard } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  type: 'video' | 'quran' | 'hadith' | 'news' | 'product';
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // Search across different content types
      const [videosRes, quranRes, hadithRes, newsRes, productsRes] = await Promise.all([
        fetch(`/api/videos?search=${encodeURIComponent(query)}`),
        fetch(`/api/quran?search=${encodeURIComponent(query)}`),
        fetch(`/api/hadith?search=${encodeURIComponent(query)}`),
        fetch(`/api/news?search=${encodeURIComponent(query)}`),
        fetch(`/api/products?search=${encodeURIComponent(query)}`),
      ]);

      const searchResults: SearchResult[] = [];

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        videosData.videos?.forEach((video: any) => {
          searchResults.push({
            type: 'video',
            id: video._id,
            title: video.title,
            description: video.description,
            url: `/videos/${video._id}`,
          });
        });
      }

      if (quranRes.ok) {
        const quranData = await quranRes.json();
        quranData.surahs?.forEach((surah: any) => {
          searchResults.push({
            type: 'quran',
            id: surah._id,
            title: `${surah.surahNumber}. ${surah.surahNameEnglish}`,
            description: surah.surahNameArabic,
            url: `/quran?surah=${surah.surahNumber}`,
          });
        });
      }

      if (hadithRes.ok) {
        const hadithData = await hadithRes.json();
        hadithData.hadiths?.slice(0, 3).forEach((hadith: any) => {
          searchResults.push({
            type: 'hadith',
            id: hadith._id,
            title: hadith.englishTranslation.substring(0, 100) + '...',
            description: `Narrated by ${hadith.narrator}`,
            url: `/hadith`,
          });
        });
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        newsData.news?.slice(0, 3).forEach((article: any) => {
          searchResults.push({
            type: 'news',
            id: article._id,
            title: article.title,
            description: article.excerpt,
            url: `/news/${article._id}`,
          });
        });
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        productsData.products?.slice(0, 3).forEach((product: any) => {
          searchResults.push({
            type: 'product',
            id: product._id,
            title: product.name,
            description: product.description,
            url: `/products/${product._id}`,
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'quran':
        return BookOpen;
      case 'hadith':
        return MessageSquare;
      case 'news':
        return Newspaper;
      case 'product':
        return ShoppingBag;
      default:
        return Search;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'quran':
        return 'Quran';
      case 'hadith':
        return 'Hadith';
      case 'news':
        return 'News';
      case 'product':
        return 'Product';
      default:
        return 'Result';
    }
  };

  if (!isOpen) return null;

  const quickFilters = [
    { label: 'Videos', value: 'video' },
    { label: 'Quran', value: 'quran' },
    { label: 'Hadith', value: 'hadith' },
    { label: 'News', value: 'news' },
    { label: 'Products', value: 'product' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-16 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-800/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white/95 dark:bg-gray-800/95 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-12 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200/60 dark:border-gray-700/60">
          <div className="bg-gradient-to-r from-primary-50/60 to-transparent dark:from-gray-800/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Islamic Hub
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search videos, Quran, Hadith, news, products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 shadow-inner focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                <Keyboard className="w-3 h-3" />
                <span>Enter</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickFilters.map((qf) => (
                <button
                  key={qf.value}
                  onClick={() => setQuery(qf.label.toLowerCase())}
                  className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {qf.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {results.map((result, index) => {
                    const Icon = getIcon(result.type);
                    return (
                      <Link
                        key={index}
                        href={result.url}
                        onClick={onClose}
                        className="flex items-start p-3 rounded-xl border border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {result.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {result.description}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 rounded-md">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {query.length > 2 && !loading && results.length === 0 && (
              <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
