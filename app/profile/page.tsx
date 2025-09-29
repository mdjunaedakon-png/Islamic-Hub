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
  Video,
  Package
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
  const [orders, setOrders] = useState<any[]>([]);
  // Booking system removed
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchUserStats();
    fetchUserActivity();
    fetchBookmarks();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
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
            

            {/* Recent Activity */}
            {/*  */}

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

            {/* Orders */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5" /> Your Orders
                </h3>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
              </div>
              <div className="p-4 space-y-3">
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500">You have no orders yet.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(o.createdAt).toLocaleString()}</div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{o.paymentMethod.toUpperCase()} • {o.status}</span>
                      </div>
                      <div className="mt-2 text-sm">{o.items.length} items • Total ${o.total.toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Booking section removed */}

            {/* Content Statistics (for admins) */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
