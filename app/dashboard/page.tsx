'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Video, 
  BookOpen, 
  MessageSquare, 
  Newspaper, 
  ShoppingBag,
  TrendingUp,
  Eye,
  Heart,
  Plus,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalNews: number;
  totalProducts: number;
  totalViews: number;
  totalLikes: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVideos: 0,
    totalNews: 0,
    totalProducts: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        if (data.user.role !== 'admin') {
          router.push('/');
          toast.error('Access denied. Admin privileges required.');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // In a real app, you would have a dedicated stats API endpoint
      // For now, we'll simulate some stats
      setStats({
        totalUsers: 1250,
        totalVideos: 89,
        totalNews: 156,
        totalProducts: 234,
        totalViews: 45678,
        totalLikes: 1234,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Upload Video',
      description: 'Add new Islamic video content',
      icon: Video,
      href: '/dashboard/videos/upload',
      color: 'bg-blue-500',
    },
    {
      title: 'Create News',
      description: 'Publish new Islamic news',
      icon: Newspaper,
      href: '/dashboard/news/create',
      color: 'bg-green-500',
    },
    {
      title: 'Add Quran',
      description: 'Add new Surah with meanings',
      icon: BookOpen,
      href: '/dashboard/quran/create',
      color: 'bg-emerald-500',
    },
    {
      title: 'Add Hadith',
      description: 'Add new Hadith with meanings',
      icon: MessageSquare,
      href: '/dashboard/hadith/create',
      color: 'bg-indigo-500',
    },
    {
      title: 'Add Product',
      description: 'Add new Islamic product',
      icon: ShoppingBag,
      href: '/dashboard/products/create',
      color: 'bg-purple-500',
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: Users,
      href: '/dashboard/users',
      color: 'bg-orange-500',
    },
    {
      title: 'Answer Questions',
      description: 'Reply to user questions',
      icon: HelpCircle,
      href: '/dashboard/questions',
      color: 'bg-teal-500',
    },
    {
      title: 'Manage Orders',
      description: 'View and update product orders',
      icon: ShoppingBag,
      href: '/dashboard/orders',
      color: 'bg-emerald-600',
    },
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Total Videos',
      value: stats.totalVideos.toLocaleString(),
      icon: Video,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Total News',
      value: stats.totalNews.toLocaleString(),
      icon: Newspaper,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user.name}! Manage your Islamic Hub content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Videos */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Videos
              </h3>
              <Link href="/dashboard/videos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Islamic Lecture Series</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>1.2k</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Nasheed Collection</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">5 hours ago</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>856</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent News */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent News
              </h3>
              <Link href="/dashboard/news" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Islamic Conference 2024</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>2.1k</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">New Islamic Center Opens</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>1.5k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hadith Management */}
        <div className="mt-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Hadith Management
              </h3>
              <div className="flex gap-2">
                <Link 
                  href="/dashboard/hadith" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Manage All
                </Link>
                <Link 
                  href="/dashboard/hadith/create" 
                  className="btn-primary text-sm flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add New
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sahih al-Bukhari</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Bukhari collection</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sahih Muslim</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Muslim collection</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Other Collections</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tirmidhi, Abu Dawud, etc.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quran Management */}
        <div className="mt-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Quran Management
              </h3>
              <div className="flex gap-2">
                <Link 
                  href="/dashboard/quran" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Manage All
                </Link>
                <Link 
                  href="/dashboard/quran/create" 
                  className="btn-primary text-sm flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add New
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Makkah Surahs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Makkah revelations</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Madinah Surahs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage Madinah revelations</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">All Surahs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete Quran management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
