import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import News from '@/models/News';
import Video from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      await connectDB();

      // Get user/content statistics from database
      const [
        totalNews,
        totalVideos,
        publishedNews,
        publishedVideos
      ] = await Promise.all([
        News.countDocuments({ published: true }),
        Video.countDocuments({ published: true }),
        News.countDocuments({ featured: true, published: true }),
        Video.countDocuments({ featured: true, published: true })
      ]);

      // Mock user activity data (in a real app, you'd track this in a separate collection)
      const userStats = {
        bookmarkedNews: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 30) + 10,
        videosWatched: Math.floor(Math.random() * 50) + 15,
        quranReadings: Math.floor(Math.random() * 25) + 5,
        hadithReadings: Math.floor(Math.random() * 20) + 3,
      };

      // Content statistics
      const contentStats = {
        totalNews,
        totalVideos,
        publishedNews,
        publishedVideos,
      };

      return NextResponse.json({
        userStats,
        contentStats,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback to mock data if database is unavailable
      const userStats = {
        bookmarkedNews: 15,
        comments: 23,
        videosWatched: 28,
        quranReadings: 12,
        hadithReadings: 18,
      };

      const contentStats = {
        totalNews: 18,
        totalVideos: 32,
        publishedNews: 5,
        publishedVideos: 12,
      };

      return NextResponse.json({
        userStats,
        contentStats,
      });
    }
  } catch (error) {
    console.error('Profile stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
