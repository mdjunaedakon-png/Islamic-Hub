'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  AlertCircle,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Surah {
  _id: string;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  totalAyahs: number;
  revelationPlace: 'makkah' | 'madinah';
  createdAt: string;
}

export default function QuranManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRevelation, setSelectedRevelation] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchSurahs();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.role !== 'admin') {
          router.push('/');
          toast.error('Admin access required');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchSurahs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedRevelation) params.append('revelationPlace', selectedRevelation);
      params.append('limit', '50');

      const response = await fetch(`/api/quran?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSurahs(data.surahs);
      } else {
        toast.error('Failed to fetch surahs');
      }
    } catch (error) {
      console.error('Error fetching surahs:', error);
      toast.error('An error occurred while fetching surahs');
    }
  };

  const handleDelete = async (surahId: string) => {
    if (!confirm('Are you sure you want to delete this surah? This action cannot be undone.')) {
      return;
    }

    setDeletingId(surahId);
    try {
      const response = await fetch(`/api/quran/${surahId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Surah deleted successfully');
        setSurahs(surahs.filter(surah => surah._id !== surahId));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete surah');
      }
    } catch (error) {
      console.error('Error deleting surah:', error);
      toast.error('An error occurred while deleting surah');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = () => {
    fetchSurahs();
  };

  const getRevelationPlaceDisplay = (place: string) => {
    return place === 'makkah' ? 'Makkah' : 'Madinah';
  };

  const getRevelationPlaceColor = (place: string) => {
    return place === 'makkah' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Admin access required to manage surahs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-600" />
                Quran Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage surahs with Arabic text, English and Bangla translations
              </p>
            </div>
            <Link
              href="/dashboard/quran/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Surah
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Surahs
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by name, text..."
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="revelation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Revelation Place
              </label>
              <select
                id="revelation"
                value={selectedRevelation}
                onChange={(e) => setSelectedRevelation(e.target.value)}
                className="input-field"
              >
                <option value="">All Places</option>
                <option value="makkah">Makkah</option>
                <option value="madinah">Madinah</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Surahs List */}
        <div className="card p-6">
          {surahs.length > 0 ? (
            <div className="space-y-4">
              {surahs.map((surah) => (
                <div key={surah._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm px-3 py-1 rounded-full font-medium">
                            #{surah.surahNumber}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRevelationPlaceColor(surah.revelationPlace)}`}>
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {getRevelationPlaceDisplay(surah.revelationPlace)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {surah.surahNameEnglish}
                        </h3>
                        <p className="text-lg text-primary-600 dark:text-primary-400 font-medium" dir="rtl">
                          {surah.surahNameArabic}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {surah.surahName} • {surah.totalAyahs} ayahs
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Created: {formatDate(surah.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/quran/${surah._id}`}
                        className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title="View Surah"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/quran/edit/${surah._id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit Surah"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(surah._id)}
                        disabled={deletingId === surah._id}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete Surah"
                      >
                        {deletingId === surah._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Surahs Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedRevelation 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by adding your first surah.'
                }
              </p>
              <Link
                href="/dashboard/quran/create"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Surah
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
