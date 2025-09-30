'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, BookOpen, MessageSquare, Newspaper, Video } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  type: 'video' | 'quran' | 'hadith' | 'news';
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function SearchInline({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (isOpen && !containerRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.length > 2) performSearch();
    else setResults([]);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const [videosRes, quranRes, hadithRes, newsRes] = await Promise.all([
        fetch(`/api/videos?search=${encodeURIComponent(query)}`),
        fetch(`/api/quran?search=${encodeURIComponent(query)}`),
        fetch(`/api/hadith?search=${encodeURIComponent(query)}`),
        fetch(`/api/news?search=${encodeURIComponent(query)}`),
      ]);
      const searchResults: SearchResult[] = [];
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        videosData.videos?.forEach((video: any) => searchResults.push({ type: 'video', id: video._id, title: video.title, description: video.description, url: `/videos/${video._id}` }));
      }
      if (quranRes.ok) {
        const quranData = await quranRes.json();
        quranData.surahs?.forEach((s: any) => searchResults.push({ type: 'quran', id: s._id, title: `${s.surahNumber}. ${s.surahNameEnglish}`, description: s.surahNameArabic, url: `/quran?surah=${s.surahNumber}` }));
      }
      if (hadithRes.ok) {
        const hadithData = await hadithRes.json();
        hadithData.hadiths?.slice(0, 3).forEach((h: any) => searchResults.push({ type: 'hadith', id: h._id, title: h.englishTranslation.substring(0, 100) + '...', description: `Narrated by ${h.narrator}`, url: `/hadith` }));
      }
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        newsData.news?.slice(0, 3).forEach((n: any) => searchResults.push({ type: 'news', id: n._id, title: n.title, description: n.excerpt, url: `/news/${n._id}` }));
      }
      setResults(searchResults);
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
      default:
        return Search;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 right-0 top-16 z-50">
      <div ref={containerRef} className="max-w-3xl mx-auto px-4">
        <div className="card p-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, Quran, Hadith, news..."
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            />
            <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading && (
            <div className="mt-3 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" />
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {results.map((r, i) => {
                const Icon = getIcon(r.type);
                return (
                  <Link key={i} href={r.url} onClick={onClose} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {query.length > 2 && !loading && results.length === 0 && (
            <div className="mt-3 text-center text-gray-500 dark:text-gray-400 text-sm">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
}
