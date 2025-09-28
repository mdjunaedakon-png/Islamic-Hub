'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Eye,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Flag,
  MoreHorizontal,
  Download,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import BookingButton from '@/components/BookingButton';

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
  dislikes: number;
  bookmarks: number;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    subscribers?: number;
  };
  comments: any[];
  createdAt: string;
  tags: string[];
}

interface Comment {
  _id: string;
  text: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  user?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  replies: Comment[];
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (id) {
      fetchVideoDetail(id as string);
      fetchComments(id as string);
      fetchRelatedVideos();
      fetchUserInteractions(id as string);
    }
  }, [id]);

  const fetchVideoDetail = async (videoId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching video with ID:', videoId);
      const response = await fetch(`/api/videos/${videoId}`);
      const data = await response.json();

      console.log('Video API response:', { status: response.status, data });

      if (response.ok) {
        setVideo(data.video);
        console.log('Video loaded successfully:', data.video.title);
      } else {
        setError(data.error || 'Failed to fetch video');
        toast.error(data.error || 'Failed to fetch video');
      }
    } catch (err) {
      console.error('Error fetching video detail:', err);
      setError('An unexpected error occurred.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (videoId: string) => {
    try {
      console.log('Fetching comments for video:', videoId);
      const response = await fetch(`/api/videos/${videoId}/comments`);
      const data = await response.json();

      console.log('Comments API response:', { status: response.status, data });

      if (response.ok) {
        setComments(data.comments);
        console.log('Comments loaded successfully:', data.comments.length);
      } else {
        console.error('Failed to fetch comments:', data.error);
        // Fallback to empty comments
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await fetch('/api/videos?limit=6');
      if (response.ok) {
        const data = await response.json();
        setRelatedVideos(data.videos.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching related videos:', error);
    }
  };

  const fetchUserInteractions = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}/interactions`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.userLiked);
        setIsDisliked(data.userDisliked);
        setIsBookmarked(data.userBookmarked);
        
        // Update video stats with current counts
        if (video && data.likes !== undefined && data.dislikes !== undefined && data.bookmarks !== undefined) {
          setVideo({
            ...video,
            likes: data.likes,
            dislikes: data.dislikes,
            bookmarks: data.bookmarks,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  };

  const handleInteraction = async (action: 'like' | 'dislike' | 'bookmark') => {
    try {
      const response = await fetch(`/api/videos/${id}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.userLiked);
        setIsDisliked(data.userDisliked);
        setIsBookmarked(data.userBookmarked);
        
        // Update video stats if available
        if (video) {
          setVideo({
            ...video,
            likes: data.likes,
            dislikes: data.dislikes,
            bookmarks: data.bookmarks,
          });
        }
        
        toast.success(data.message);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update interaction');
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/videos/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment('');
        toast.success('Comment added successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const getCommentAuthor = (comment: Comment) => {
    return comment.author || comment.user || { name: 'Anonymous User', _id: 'anonymous', avatar: '' };
  };

  const handlePlayPause = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      setDuration(videoElement.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      const newTime = parseFloat(e.target.value);
      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      const newVolume = parseFloat(e.target.value);
      videoElement.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      if (isMuted) {
        videoElement.volume = volume;
        setIsMuted(false);
      } else {
        videoElement.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleLike = () => handleInteraction('like');
  const handleDislike = () => handleInteraction('dislike');
  const handleBookmark = () => handleInteraction('bookmark');

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        text: video?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatViews = (views: number | undefined) => {
    if (!views || views === 0) {
      return '0';
    }
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {error || 'Video Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The video you are looking for might have been moved, deleted, or does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary flex items-center justify-center gap-2 mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Videos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* YouTube Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              {(() => {
                // Extract YouTube video ID from URL
                const getYouTubeVideoId = (url: string) => {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = url.match(regExp);
                  return (match && match[2].length === 11) ? match[2] : null;
                };

                const videoId = getYouTubeVideoId(video.videoUrl);
                
                if (!videoId) {
                  return (
                    <div className="aspect-video flex items-center justify-center bg-gray-800">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold mb-2">Invalid Video URL</h3>
                        <p className="text-gray-400 mb-4">
                          The provided video URL is not a valid YouTube link.
                        </p>
                      </div>
                    </div>
                  );
                }

                const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://islamichub-sigma.vercel.app'}`;

                return (
                  <iframe
                    className="w-full aspect-video"
                    src={embedUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              })()}
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              {/* Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {video.title}
                </h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatViews(video.likes || 0)}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isDisliked
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{formatViews(video.dislikes || 0)}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <BookingButton
                    videoId={video._id}
                    videoTitle={video.title}
                    videoDescription={video.description}
                    videoThumbnail={video.thumbnail}
                    videoUrl={video.videoUrl}
                    videoCategory={video.category}
                    videoDuration={video.duration}
                    videoAuthor={video.author}
                    size="md"
                  />
                  {/* <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button> */}
                </div>
              </div>

              {/* Video Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatViews(video.views || 0)} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(video.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full uppercase">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="mt-4">
                  <p className={`text-gray-700 dark:text-gray-300 ${!showDescription ? 'line-clamp-3' : ''}`}>
                    {video.description}
                  </p>
                  {video.description.length > 200 && (
                    <button
                      onClick={() => setShowDescription(!showDescription)}
                      className="text-primary-600 hover:text-primary-700 font-medium mt-2"
                    >
                      {showDescription ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Comments ({comments.length})
                </h3>
                
                {/* Add Comment */}
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                        {getCommentAuthor(comment).avatar ? (
                          <img 
                            src={getCommentAuthor(comment).avatar} 
                            alt={getCommentAuthor(comment).name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getCommentAuthor(comment).name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-primary-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-500 hover:text-primary-600">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Related Videos
            </h3>
            <div className="space-y-3">
              {relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo._id}
                  href={`/videos/${relatedVideo._id}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                      {formatTime(relatedVideo.duration)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {relatedVideo.author.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{formatViews(relatedVideo.views || 0)} views</span>
                      <span>•</span>
                      <span>{formatDate(relatedVideo.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
