'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Heart,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookmarkButton from '@/components/BookmarkButton';

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

export default function HadithDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [relatedHadiths, setRelatedHadiths] = useState<Hadith[]>([]);

  useEffect(() => {
    if (id) {
      fetchHadith(id as string);
      fetchRelatedHadiths();
    }
  }, [id]);

  const fetchHadith = async (hadithId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching hadith with ID:', hadithId);
      const response = await fetch(`/api/hadith/${hadithId}`);
      const data = await response.json();

      console.log('Hadith API response:', { status: response.status, data });

      if (response.ok) {
        setHadith(data.hadith);
        console.log('Hadith loaded successfully:', data.hadith.hadithNumber);
      } else {
        setError(data.error || 'Failed to fetch hadith');
        toast.error(data.error || 'Failed to fetch hadith');
      }
    } catch (err) {
      console.error('Error fetching hadith detail:', err);
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedHadiths = async () => {
    try {
      const response = await fetch('/api/hadith?limit=6');
      if (response.ok) {
        const data = await response.json();
        setRelatedHadiths(data.hadiths.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching related hadiths:', error);
    }
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

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Hadith #${hadith?.hadithNumber} - ${getCollectionDisplayName(hadith?.collectionName || '')}`,
          text: hadith?.englishTranslation,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Text copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying text:', error);
      toast.error('Failed to copy text');
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
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading hadith...</p>
        </div>
      </div>
    );
  }

  if (error || !hadith) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Hadith Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the hadith you're looking for. It may have been moved, deleted, or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/hadith')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Browse Hadiths
            </button>
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hadiths
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hadith Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hadith Header */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Hadith #{hadith.hadithNumber}
                    </h1>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {getCollectionDisplayName(hadith.collectionName)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookmarkButton
                    contentType="hadith"
                    contentId={hadith._id}
                    contentTitle={`${getCollectionDisplayName(hadith.collectionName)} #${hadith.hadithNumber}`}
                    contentDescription={hadith.englishTranslation}
                    contentUrl={`/hadith/${hadith._id}`}
                    metadata={{
                      hadithNumber: hadith.hadithNumber,
                      collectionName: hadith.collectionName,
                      narrator: hadith.narrator,
                      chapter: hadith.chapter,
                    }}
                    size="md"
                  />
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-colors ${
                      liked
                        ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900'
                    }`}
                    title="Like"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Hadith Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Chapter</span>
                  <p className="text-gray-900 dark:text-white">{hadith.chapter}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Book</span>
                  <p className="text-gray-900 dark:text-white">{hadith.book}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Narrator</span>
                  <p className="text-gray-900 dark:text-white">{hadith.narrator}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Added</span>
                  <p className="text-gray-900 dark:text-white">{formatDate(hadith.createdAt)}</p>
                </div>
              </div>

              {/* Tags */}
              {hadith.tags.length > 0 && (
                <div className="mb-6">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {hadith.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Arabic Text */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Arabic Text</h2>
                <button
                  onClick={() => handleCopyText(hadith.arabicText)}
                  className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Copy Arabic Text"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <p 
                  className="text-2xl leading-relaxed text-gray-900 dark:text-white"
                  dir="rtl"
                  style={{ textAlign: 'right', fontFamily: 'Amiri, serif' }}
                >
                  {hadith.arabicText}
                </p>
              </div>
            </div>

            {/* English Translation */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">English Translation</h2>
                <button
                  onClick={() => handleCopyText(hadith.englishTranslation)}
                  className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Copy English Translation"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {hadith.englishTranslation}
                </p>
              </div>
            </div>

            {/* Bangla Translation */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">বাংলা অনুবাদ</h2>
                <button
                  onClick={() => handleCopyText(hadith.banglaTranslation)}
                  className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Copy Bangla Translation"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {hadith.banglaTranslation}
                </p>
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
                <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <BookmarkButton
                    contentType="hadith"
                    contentId={hadith._id}
                    contentTitle={`${getCollectionDisplayName(hadith.collectionName)} #${hadith.hadithNumber}`}
                    contentDescription={hadith.englishTranslation}
                    contentUrl={`/hadith/${hadith._id}`}
                    metadata={{
                      hadithNumber: hadith.hadithNumber,
                      collectionName: hadith.collectionName,
                      narrator: hadith.narrator,
                      chapter: hadith.chapter,
                    }}
                    size="sm"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Bookmark</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    liked
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Related Hadiths */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Hadiths
              </h3>
              <div className="space-y-3">
                {relatedHadiths.length > 0 ? (
                  relatedHadiths
                    .filter(h => h._id !== hadith._id)
                    .slice(0, 5)
                    .map((relatedHadith) => (
                      <Link
                        key={relatedHadith._id}
                        href={`/hadith/${relatedHadith._id}`}
                        className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded">
                            {getCollectionDisplayName(relatedHadith.collectionName)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{relatedHadith.hadithNumber}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {relatedHadith.englishTranslation}
                        </p>
                      </Link>
                    ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No related hadiths found</p>
                )}
              </div>
            </div>

            {/* Collection Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Collection Info
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Collection</span>
                  <p className="text-gray-900 dark:text-white">{getCollectionDisplayName(hadith.collectionName)}</p>
                </div>
                {hadith.volume && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Volume</span>
                    <p className="text-gray-900 dark:text-white">{hadith.volume}</p>
                  </div>
                )}
                {hadith.page && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Page</span>
                    <p className="text-gray-900 dark:text-white">{hadith.page}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
