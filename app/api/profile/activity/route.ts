import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';
import Product from '@/models/Product';
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

      // Get recent activity data
      const [
        recentProducts,
        recentNews,
        recentVideos
      ] = await Promise.all([
        Product.find({ active: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name category createdAt images')
          .lean(),
        News.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title category createdAt image')
          .lean(),
        Video.find({ published: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title category createdAt thumbnail')
          .lean()
      ]);

      // Mock recent activity (in a real app, you'd track user interactions)
      const recentActivity = [
        {
          id: '1',
          type: 'login',
          description: 'Logged in successfully',
          timestamp: new Date().toISOString(),
          icon: 'login',
          color: 'green'
        },
        {
          id: '2',
          type: 'product_view',
          description: 'Viewed Islamic Book Collection',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          icon: 'eye',
          color: 'blue'
        },
        {
          id: '3',
          type: 'news_bookmark',
          description: 'Bookmarked "Ramadan 2024 Guidelines"',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          icon: 'bookmark',
          color: 'yellow'
        },
        {
          id: '4',
          type: 'video_watch',
          description: 'Watched "Understanding Prayer"',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          icon: 'play',
          color: 'purple'
        },
        {
          id: '5',
          type: 'quran_read',
          description: 'Read Surah Al-Fatiha',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          icon: 'book',
          color: 'green'
        },
        {
          id: '6',
          type: 'comment',
          description: 'Commented on "Islamic Architecture"',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          icon: 'message',
          color: 'blue'
        }
      ];

      return NextResponse.json({
        recentActivity,
        recentProducts,
        recentNews,
        recentVideos
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback to mock data
      const recentActivity = [
        {
          id: '1',
          type: 'login',
          description: 'Logged in successfully',
          timestamp: new Date().toISOString(),
          icon: 'login',
          color: 'green'
        },
        {
          id: '2',
          type: 'product_view',
          description: 'Viewed Islamic Book Collection',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          icon: 'eye',
          color: 'blue'
        },
        {
          id: '3',
          type: 'news_bookmark',
          description: 'Bookmarked "Ramadan 2024 Guidelines"',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          icon: 'bookmark',
          color: 'yellow'
        },
        {
          id: '4',
          type: 'video_watch',
          description: 'Watched "Understanding Prayer"',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          icon: 'play',
          color: 'purple'
        },
        {
          id: '5',
          type: 'quran_read',
          description: 'Read Surah Al-Fatiha',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          icon: 'book',
          color: 'green'
        }
      ];

      return NextResponse.json({
        recentActivity,
        recentProducts: [],
        recentNews: [],
        recentVideos: []
      });
    }
  } catch (error) {
    console.error('Profile activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
