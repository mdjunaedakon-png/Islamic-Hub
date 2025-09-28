import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { getCurrentUser } from '@/lib/auth';

// POST check if content is bookmarked
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { contentType, contentId } = await request.json();

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'Content type and ID are required' },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      const bookmark = await Bookmark.findOne({
        user: user.id,
        contentType,
        contentId,
      });

      return NextResponse.json({
        isBookmarked: !!bookmark,
        bookmark: bookmark || null,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // For demo purposes, return false
      return NextResponse.json({
        isBookmarked: false,
        bookmark: null,
      });
    }
  } catch (error) {
    console.error('Check bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
