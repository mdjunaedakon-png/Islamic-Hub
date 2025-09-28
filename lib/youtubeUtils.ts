/**
 * Utility functions for YouTube video handling
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+\/.*#\w\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate YouTube thumbnail URL from video ID
 * YouTube provides multiple thumbnail qualities:
 * - maxresdefault: 1280x720 (best quality)
 * - hqdefault: 480x360 (high quality)
 * - mqdefault: 320x180 (medium quality)
 * - default: 120x90 (lowest quality)
 */
export function getYouTubeThumbnail(videoId: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'default' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Auto-generate thumbnail from YouTube URL
 */
export function generateThumbnailFromYouTubeUrl(videoUrl: string): string | null {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) {
    return null;
  }
  
  return getYouTubeThumbnail(videoId, 'hqdefault');
}

/**
 * Get all available thumbnail qualities for a YouTube video
 */
export function getAllYouTubeThumbnails(videoId: string) {
  return {
    maxres: getYouTubeThumbnail(videoId, 'maxresdefault'),
    hq: getYouTubeThumbnail(videoId, 'hqdefault'),
    mq: getYouTubeThumbnail(videoId, 'mqdefault'),
    default: getYouTubeThumbnail(videoId, 'default')
  };
}
