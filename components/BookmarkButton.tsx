'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
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
    narrator?: string;
    chapter?: string;
    category?: string;
    author?: string;
    duration?: number;
    views?: number;
    likes?: number;
    price?: number;
    stock?: number;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({
  contentType,
  contentId,
  contentTitle,
  contentDescription = '',
  contentImage = '',
  contentUrl = '',
  metadata = {},
  className = '',
  size = 'md',
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    checkBookmarkStatus();
  }, [contentType, contentId]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch('/api/bookmarks/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          contentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        setBookmarkId(data.bookmark?._id || null);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        if (bookmarkId) {
          const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setIsBookmarked(false);
            setBookmarkId(null);
            toast.success('Removed from bookmarks');
          } else {
            toast.error('Failed to remove bookmark');
          }
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType,
            contentId,
            contentTitle,
            contentDescription,
            contentImage,
            contentUrl,
            metadata,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsBookmarked(true);
          setBookmarkId(data.bookmark._id);
          toast.success('Added to bookmarks');
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to add bookmark');
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`
        ${getSizeClasses()}
        flex items-center justify-center
        rounded-lg transition-all duration-200
        ${isBookmarked
          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900 hover:text-yellow-600 dark:hover:text-yellow-400'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent">
          <div className={getIconSize()} />
        </div>
      ) : isBookmarked ? (
        <BookmarkCheck className={getIconSize()} />
      ) : (
        <Bookmark className={getIconSize()} />
      )}
    </button>
  );
}
