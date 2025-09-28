'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Eye, Heart } from 'lucide-react';

interface YouTubePlayerProps {
  video: {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    category: string;
    duration: number;
    views: number;
    likes: number;
    author: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubePlayer({ video, isOpen, onClose }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(video.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}` : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePlayPause = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const player = iframe.contentWindow;
      
      if (isPlaying) {
        player?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        player?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const player = iframe.contentWindow;
      
      if (isMuted) {
        player?.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        player?.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!document.fullscreenElement) {
        iframeRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    setVideoError(false);
  };

  if (!isOpen) return null;

  if (!videoId || !embedUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-black rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gray-900">
            <h2 className="text-xl font-semibold text-white truncate pr-4">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="aspect-video flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-2">Invalid YouTube URL</h3>
              <p className="text-gray-400 mb-4">
                The provided YouTube URL is not valid or the video is not available.
              </p>
              <button
                onClick={onClose}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h2 className="text-xl font-semibold text-white truncate pr-4">
            {video.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* YouTube Video Container */}
        <div 
          className="relative bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {videoError ? (
            <div className="aspect-video flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold mb-2">Video Not Available</h3>
                <p className="text-gray-400 mb-4">
                  This YouTube video cannot be played. It may have been removed, made private, or is not available in your region.
                </p>
                <button
                  onClick={() => {
                    setVideoError(false);
                    // Reload the iframe
                    if (iframeRef.current) {
                      iframeRef.current.src = iframeRef.current.src;
                    }
                  }}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              className="w-full aspect-video"
              src={embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={handleVideoError}
              onLoad={handleVideoLoad}
            />
          )}

          {/* Custom Controls Overlay */}
          {!videoError && showControls && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end">
              {/* Control Buttons */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4 bg-gray-900">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                By {video.author.name} • {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-300 line-clamp-2">
                {video.description}
              </p>
            </div>
            <div className="ml-4 flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{video.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{video.likes}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded uppercase">
              {video.category}
            </span>
            <div className="text-sm text-gray-400">
              Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
