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
  Plus,
  MapPin,
  Play
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

interface NavbarItem {
  _id: string;
  title: string;
  titleBengali: string;
  href: string;
  type: 'main' | 'location' | 'dropdown';
  parentId?: {
    _id: string;
    title: string;
    titleBengali: string;
  };
  order: number;
  isActive: boolean;
  icon?: string;
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
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchNews();
    fetchNavbarItems();
    fetchUser();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchNavbarItems = async () => {
    try {
      const response = await fetch('/api/navbar');
      if (response.ok) {
        const data = await response.json();
        setNavbarItems(data.navbarItems);
      }
    } catch (error) {
      console.error('Error fetching navbar items:', error);
    }
  };

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

  const getMainNavItems = () => {
    return navbarItems.filter(item => item.type === 'main' && item.isActive).sort((a, b) => a.order - b.order);
  };

  const getLocationNavItems = () => {
    return navbarItems.filter(item => item.type === 'location' && item.isActive).sort((a, b) => a.order - b.order);
  };

  const getDropdownItems = (parentId: string) => {
    return navbarItems.filter(item => item.parentId?._id === parentId && item.isActive).sort((a, b) => a.order - b.order);
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
      {/* Custom News Navbar */}
      <div className="bg-teal-600 text-white">
        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-8">
              {getMainNavItems().map((item) => {
                const dropdownItems = getDropdownItems(item._id);
                return (
                  <div key={item._id} className="relative group">
                    <Link 
                      href={item.href} 
                      className="hover:text-teal-200 transition-colors font-medium flex items-center"
                    >
                      {item.titleBengali}
                      {dropdownItems.length > 0 && (
                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>
                    
                    {dropdownItems.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-teal-800 rounded-lg shadow-lg border border-teal-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem._id}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-white hover:bg-teal-700 transition-colors"
                            >
                              {dropdownItem.titleBengali}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Navigation */}
        <div className="bg-teal-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-6 py-2">
              {getLocationNavItems().map((item) => (
                <Link 
                  key={item._id}
                  href={item.href} 
                  className="hover:text-teal-200 transition-colors text-sm"
                >
                  {item.titleBengali}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Location Bar */}
        <div className="bg-teal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 py-1">
              <Link href="/news?location=barisal" className="hover:text-teal-200 transition-colors text-sm">
                বরিশাল
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* News Headlines Ticker */}
      <div className="bg-gray-200 dark:bg-gray-700 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
              সংবাদ শিরোনাম:
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-8">
                  কল সিলগালা • গলাচিপা হাসপাতালে অনিয়মের প্রতিবাদে মানববন্ধন • দুমকীতে মা ইলিশ সংরক্ষণ অভিযানে জালসহ আটক ২ • ৯ দিনের ছুটি শেষে আবারও প্রাণ ফিরে পেল
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisement Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-6">
            <p className="text-lg font-medium text-amber-800 dark:text-amber-200">
              আপনার প্রতিষ্ঠানের বিশ্বব্যাপী প্রচারের জন্য বিজ্ঞাপন দিন
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Featured News */}
          <div className="lg:col-span-2">
            {news.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src={safeNextImageSrc(news[0].image)}
                    alt={news[0].title}
                    width={800}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[news[0].category]}`}>
                      {getCategoryName(news[0].category)}
                    </span>
                  </div>
                  {news[0].featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {news[0].title}
                  </h1>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {news[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(news[0].createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{news[0].views}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/news/${news[0]._id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    বিস্তারিত পড়ুন →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Latest News */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    সর্বশেষ সংবাদ
                  </h3>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button className="px-3 py-1 text-sm bg-teal-600 text-white rounded-md">
                      সর্বশেষ
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      আলোচিত
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {news.slice(1, 5).map((article, index) => (
                  <div key={article._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="relative w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2">
                        <Image
                          src={safeNextImageSrc(article.image)}
                          alt={article.title}
                          width={64}
                          height={48}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uncategorized News */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Uncategorized
                </h3>
              </div>
              
              <div className="p-4 space-y-4">
                {news.slice(5, 7).map((article) => (
                  <div key={article._id} className="flex items-start space-x-3">
                    <div className="relative w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded">
                      <Image
                        src={safeNextImageSrc(article.image)}
                        alt={article.title}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                ))}
                
                <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium">
                  আরো খবর.. >
                </button>
              </div>
            </div>

            {/* Live TV */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Play className="w-5 h-5 text-red-500 mr-2" />
                  লাইভ টিভি
                </h3>
              </div>
              
              <div className="p-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Live Stream</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional News Grid */}
        {news.length > 5 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              আরো সংবাদ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(5).map((article) => (
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
                    
                    <Link
                      href={`/news/${article._id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom News Ticker */}
      <div className="bg-teal-600 text-white py-2 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-4">
              সংবাদ শিরোনাম:
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-sm mr-8">
                  কল সিলগালা • গলাচিপা হাসপাতালে অনিয়মের প্রতিবাদে মানববন্ধন • দুমকীতে মা ইলিশ সংরক্ষণ অভিযানে জালসহ আটক ২ • ৯ দিনের ছুটি শেষে আবারও প্রাণ ফিরে পেল
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}