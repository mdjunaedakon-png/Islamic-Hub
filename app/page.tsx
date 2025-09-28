'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  Eye,
  Filter,
  Search,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
// Booking system removed

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: 'lecture' | 'nasheed' | 'dawah';
  duration: number;
  views: number;
  likes: number;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  comments: any[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'lecture', label: 'Lectures' },
    { value: 'nasheed', label: 'Nasheed' },
    { value: 'dawah', label: 'Dawah' },
  ];

  useEffect(() => {
    fetchVideos();
    fetchUser();
  }, [selectedCategory, searchTerm]);

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

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/videos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      toast.error('Error fetching videos');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setVideos(videos.map(video => 
          video._id === videoId 
            ? { ...video, likes: video.likes + 1 }
            : video
        ));
        toast.success('Video liked!');
      }
    } catch (error) {
      toast.error('Error liking video');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const handleShare = (videoId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Islamic Video',
        text: 'Check out this Islamic video',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="gradient-bg islamic-pattern py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-shadow-lg">
            Welcome to <span className="text-primary-600">Islamic Hub</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your complete Islamic resource center. Access Quran, Hadith, Islamic videos, 
            news, and products all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quran" className="btn-primary text-lg px-8 py-3">
              Explore Quran
            </Link>
            <Link href="/hadith" className="btn-secondary text-lg px-8 py-3">
              Read Hadith
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search videos..."
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
              
              {user?.role === 'admin' && (
                <Link href="/dashboard/videos/upload" className="btn-primary flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="card overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <Link 
                    href={`/videos/${video._id}`}
                    className="relative cursor-pointer block"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded uppercase">
                        {video.category}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(video.createdAt)}
                      </span>
                      {/* Booking button removed */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to upload an Islamic video!'
                }
              </p>
              {user?.role === 'admin' && (
                <Link href="/dashboard/videos/upload" className="btn-primary">
                  Upload Video
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
