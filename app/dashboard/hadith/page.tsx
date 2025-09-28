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
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Hadith {
  _id: string;
  collectionName: string;
  hadithNumber: string;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
  narrator: string;
  chapter: string;
  book: string;
  volume?: string;
  page?: string;
  tags: string[];
  createdAt: string;
}

export default function HadithManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchHadiths();
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

  const fetchHadiths = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCollection) params.append('collection', selectedCollection);
      params.append('limit', '50');

      const response = await fetch(`/api/hadith?${params}`);
      if (response.ok) {
        const data = await response.json();
        setHadiths(data.hadiths);
      } else {
        toast.error('Failed to fetch hadiths');
      }
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      toast.error('An error occurred while fetching hadiths');
    }
  };

  const handleDelete = async (hadithId: string) => {
    if (!confirm('Are you sure you want to delete this hadith? This action cannot be undone.')) {
      return;
    }

    setDeletingId(hadithId);
    try {
      const response = await fetch(`/api/hadith/${hadithId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Hadith deleted successfully');
        setHadiths(hadiths.filter(hadith => hadith._id !== hadithId));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete hadith');
      }
    } catch (error) {
      console.error('Error deleting hadith:', error);
      toast.error('An error occurred while deleting hadith');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = () => {
    fetchHadiths();
  };

  const getCollectionDisplayName = (collection: string) => {
    const names: { [key: string]: string } = {
      bukhari: 'Sahih al-Bukhari',
      muslim: 'Sahih Muslim',
      tirmidhi: 'Jami\' at-Tirmidhi',
      abu_dawud: 'Sunan Abu Dawud',
      nasai: 'Sunan an-Nasai',
      ibn_majah: 'Sunan Ibn Majah',
    };
    return names[collection] || collection;
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
          <p className="text-gray-600 dark:text-gray-400">Admin access required to manage hadiths.</p>
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
                Hadith Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage hadiths with Arabic text, English and Bangla translations
              </p>
            </div>
            <Link
              href="/dashboard/hadith/create"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Hadith
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Hadiths
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by text, narrator, chapter..."
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="collection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Collection
              </label>
              <select
                id="collection"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="input-field"
              >
                <option value="">All Collections</option>
                <option value="bukhari">Sahih al-Bukhari</option>
                <option value="muslim">Sahih Muslim</option>
                <option value="tirmidhi">Jami' at-Tirmidhi</option>
                <option value="abu_dawud">Sunan Abu Dawud</option>
                <option value="nasai">Sunan an-Nasai</option>
                <option value="ibn_majah">Sunan Ibn Majah</option>
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

        {/* Hadiths List */}
        <div className="card p-6">
          {hadiths.length > 0 ? (
            <div className="space-y-4">
              {hadiths.map((hadith) => (
                <div key={hadith._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded">
                          {getCollectionDisplayName(hadith.collectionName)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          #{hadith.hadithNumber}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          {hadith.chapter} - {hadith.book}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Narrated by: {hadith.narrator}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                          {hadith.englishTranslation}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Created: {formatDate(hadith.createdAt)}</span>
                        {hadith.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>Tags:</span>
                            {hadith.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                            {hadith.tags.length > 3 && (
                              <span>+{hadith.tags.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/hadith/${hadith._id}`}
                        className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title="View Hadith"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/hadith/edit/${hadith._id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit Hadith"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(hadith._id)}
                        disabled={deletingId === hadith._id}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete Hadith"
                      >
                        {deletingId === hadith._id ? (
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
                No Hadiths Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || selectedCollection 
                  ? 'Try adjusting your search criteria.' 
                  : 'Get started by adding your first hadith.'
                }
              </p>
              <Link
                href="/dashboard/hadith/create"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Hadith
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
