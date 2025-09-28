'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookmarkButton from '@/components/BookmarkButton';

interface News {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  featured: boolean;
  views: number;
  tags: string[];
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function NewsDetailPage() {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  useEffect(() => {
    fetchNews();
    fetchUser();
  }, [newsId]);

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
      const response = await fetch(`/api/news/${newsId}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.news);
      } else if (response.status === 404) {
        toast.error('News article not found');
        router.push('/news');
      } else {
        toast.error('Error loading news article');
      }
    } catch (error) {
      toast.error('Error loading news article');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark articles');
      return;
    }
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = news?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            News Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The news article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/news" className="btn-primary">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <BookmarkButton
                contentType="news"
                contentId={news._id}
                contentTitle={news.title}
                contentDescription={news.excerpt}
                contentImage={news.image}
                contentUrl={`/news/${news._id}`}
                metadata={{
                  category: news.category,
                  author: news.author.name,
                  views: news.views,
                }}
                size="md"
              />
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="card p-8">
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-sm px-3 py-1 rounded-full">
              {news.category}
            </span>
            {news.featured && (
              <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-sm px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {news.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {news.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {news.content}
            </div>
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with related articles */}
            <div className="card p-6">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Related Article Title
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Brief description of the related article...
              </p>
            </div>
            <div className="card p-6">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Another Related Article
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Brief description of another related article...
              </p>
            </div>
            <div className="card p-6">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Third Related Article
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Brief description of the third related article...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
