'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { safeNextImageSrc } from '@/lib/imageUtils';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface News {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: 'islamic' | 'world' | 'local' | 'technology' | 'education';
  author: {
    _id: string;
    name: string;
    email: string;
  };
  published: boolean;
  featured: boolean;
  views: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'islamic', label: 'Islamic News' },
  { value: 'world', label: 'World News' },
  { value: 'local', label: 'Local News' },
  { value: 'technology', label: 'Technology' },
  { value: 'education', label: 'Education' },
];

const categoryColors = {
  islamic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  world: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  local: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  technology: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  education: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchNews();
    fetchUser();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('page', currentPage.toString());
      
      const response = await fetch(`/api/news?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      toast.error('Error fetching news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryName = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded" />
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
                <Newspaper className="w-8 h-8 text-primary-600" />
                Islamic News
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Stay updated with the latest Islamic news and events
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <Link href="/dashboard/news/create" className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create News
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <article key={article._id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <Image
                    src={safeNextImageSrc(article.image)}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[article.category]}`}>
                      {getCategoryName(article.category)}
                    </span>
                  </div>
                  {article.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    
                    <Link
                      href={`/news/${article._id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                  
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No news found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria.'
                : 'No news articles available at the moment.'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg ${
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
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
