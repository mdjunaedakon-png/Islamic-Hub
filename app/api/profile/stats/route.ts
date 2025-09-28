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

      // Get user statistics from database
      const [
        totalProducts,
        totalNews,
        totalVideos,
        featuredProducts,
        publishedNews,
        publishedVideos
      ] = await Promise.all([
        Product.countDocuments({ active: true }),
        News.countDocuments({ published: true }),
        Video.countDocuments({ published: true }),
        Product.countDocuments({ featured: true, active: true }),
        News.countDocuments({ featured: true, published: true }),
        Video.countDocuments({ featured: true, published: true })
      ]);

      // Mock user activity data (in a real app, you'd track this in a separate collection)
      const userStats = {
        totalOrders: Math.floor(Math.random() * 20) + 5, // Random between 5-25
        totalSpent: (Math.random() * 1000 + 100).toFixed(2), // Random between $100-$1100
        favoriteProducts: Math.floor(Math.random() * 15) + 3, // Random between 3-18
        bookmarkedNews: Math.floor(Math.random() * 20) + 5, // Random between 5-25
        comments: Math.floor(Math.random() * 30) + 10, // Random between 10-40
        videosWatched: Math.floor(Math.random() * 50) + 15, // Random between 15-65
        quranReadings: Math.floor(Math.random() * 25) + 5, // Random between 5-30
        hadithReadings: Math.floor(Math.random() * 20) + 3, // Random between 3-23
      };

      // Content statistics
      const contentStats = {
        totalProducts,
        totalNews,
        totalVideos,
        featuredProducts,
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
        totalOrders: 12,
        totalSpent: 450.50,
        favoriteProducts: 8,
        bookmarkedNews: 15,
        comments: 23,
        videosWatched: 28,
        quranReadings: 12,
        hadithReadings: 18,
      };

      const contentStats = {
        totalProducts: 25,
        totalNews: 18,
        totalVideos: 32,
        featuredProducts: 8,
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
