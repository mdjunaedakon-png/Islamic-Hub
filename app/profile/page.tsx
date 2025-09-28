'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X,
  Camera,
  Bell,
  Lock,
  Heart,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  Star,
  Settings,
  BarChart3,
  Video
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteProducts: number;
  bookmarkedNews: number;
  comments: number;
  videosWatched: number;
  quranReadings: number;
  hadithReadings: number;
}

interface ContentStats {
  totalProducts: number;
  totalNews: number;
  totalVideos: number;
  featuredProducts: number;
  publishedNews: number;
  publishedVideos: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface Bookmark {
  _id: string;
  contentType: 'video' | 'news' | 'hadith' | 'quran' | 'product';
  contentId: string;
  contentTitle: string;
  contentDescription?: string;
  contentImage?: string;
  contentUrl?: string;
  metadata?: {
    surahNumber?: number;
    ayahNumber?: number;
    hadithNumber?: string;
    collectionName?: string;
    category?: string;
    author?: string;
    duration?: number;
    views?: number;
    likes?: number;
  };
  createdAt: string;
}

// Booking system removed

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
  });
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    favoriteProducts: 0,
    bookmarkedNews: 0,
    comments: 0,
    videosWatched: 0,
    quranReadings: 0,
    hadithReadings: 0,
  });
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalProducts: 0,
    totalNews: 0,
    totalVideos: 0,
    featuredProducts: 0,
    publishedNews: 0,
    publishedVideos: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  // Booking system removed
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchUserStats();
    fetchUserActivity();
    fetchBookmarks();
    // Booking system removed
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setEditForm({
          name: data.user.name,
          email: data.user.email,
        });
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/profile/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.userStats);
        setContentStats(data.contentStats);
      } else {
        console.error('Failed to fetch user stats');
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchUserActivity = async () => {
    try {
      const response = await fetch('/api/profile/activity');
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.recentActivity);
      } else {
        console.error('Failed to fetch user activity');
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const fetchBookmarks = async () => {
    setBookmarksLoading(true);
    try {
      const response = await fetch('/api/bookmarks?limit=20');
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      } else {
        console.error('Failed to fetch bookmarks');
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  // Booking system removed

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = async () => {
    try {
      // In a real app, you'd update the user via API
      toast.success('Profile updated successfully!');
      setEditing(false);
      // Refresh user data
      fetchUser();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getBookmarkUrl = (bookmark: Bookmark) => {
    switch (bookmark.contentType) {
      case 'video':
        return `/videos/${bookmark.contentId}`;
      case 'news':
        return `/news/${bookmark.contentId}`;
      case 'hadith':
        return `/hadith/${bookmark.contentId}`;
      case 'quran':
        return `/quran/${bookmark.contentId}`;
      case 'product':
        return `/products/${bookmark.contentId}`;
      default:
        return '#';
    }
  };

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
                <User className="w-8 h-8 text-primary-600" />
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editing ? 'Update your profile picture' : 'Profile Picture'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-600" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Your Activity
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">${stats.totalSpent}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoriteProducts}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bookmarkedNews}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bookmarks</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.comments}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                </div>
              </div>

              {/* Additional Activity Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 text-purple-500 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.videosWatched}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Videos Watched</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 text-green-500 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.quranReadings}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quran Readings</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 text-orange-500 mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hadithReadings}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hadith Readings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Browse Products</span>
                </Link>
                <Link
                  href="/news"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Read News</span>
                </Link>
                <Link
                  href="/quran"
                  className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Read Quran</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Settings
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Privacy Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                      <div className="flex-1">
                        <span className="text-gray-600 dark:text-gray-400">{activity.description}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Your Bookmarks
              </h3>
              <div className="space-y-3">
                {bookmarksLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading bookmarks...</p>
                  </div>
                ) : bookmarks.length > 0 ? (
                  bookmarks.slice(0, 6).map((bookmark) => (
                    <div key={bookmark._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex-shrink-0">
                        {bookmark.contentImage ? (
                          <img
                            src={bookmark.contentImage}
                            alt={bookmark.contentTitle}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            {bookmark.contentType === 'video' && <Video className="w-6 h-6 text-primary-600" />}
                            {bookmark.contentType === 'news' && <MessageSquare className="w-6 h-6 text-primary-600" />}
                            {bookmark.contentType === 'hadith' && <BookOpen className="w-6 h-6 text-primary-600" />}
                            {bookmark.contentType === 'quran' && <BookOpen className="w-6 h-6 text-primary-600" />}
                            {bookmark.contentType === 'product' && <ShoppingBag className="w-6 h-6 text-primary-600" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {bookmark.contentTitle}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {bookmark.contentDescription || `${bookmark.contentType.charAt(0).toUpperCase() + bookmark.contentType.slice(1)}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                            {bookmark.contentType}
                          </span>
                          {bookmark.metadata?.surahNumber && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Surah {bookmark.metadata.surahNumber}
                            </span>
                          )}
                          {bookmark.metadata?.hadithNumber && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              #{bookmark.metadata.hadithNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href={getBookmarkUrl(bookmark)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No bookmarks yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Start bookmarking content you want to save for later
                    </p>
                  </div>
                )}
              </div>
              {bookmarks.length > 6 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/profile/bookmarks"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    View all bookmarks ({bookmarks.length})
                  </Link>
                </div>
              )}
            </div>

            {/* Booking section removed */}

            {/* Content Statistics (for admins) */}
            {user.role === 'admin' && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Content Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Products</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contentStats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total News</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contentStats.totalNews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Videos</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contentStats.totalVideos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Featured Content</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {contentStats.featuredProducts + contentStats.publishedNews + contentStats.publishedVideos}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
