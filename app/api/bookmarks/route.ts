import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { getCurrentUser } from '@/lib/auth';

// GET user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const contentType = searchParams.get('type');

    try {
      await connectDB();

      const query: any = { user: user.id };
      if (contentType) {
        query.contentType = contentType;
      }

      const bookmarks = await Bookmark.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Bookmark.countDocuments(query);

      return NextResponse.json({
        bookmarks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create bookmark
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const {
      contentType,
      contentId,
      contentTitle,
      contentDescription,
      contentImage,
      contentUrl,
      metadata,
    } = await request.json();

    if (!contentType || !contentId || !contentTitle) {
      return NextResponse.json(
        { error: 'Content type, ID, and title are required' },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      // Check if bookmark already exists
      const existingBookmark = await Bookmark.findOne({
        user: user.id,
        contentType,
        contentId,
      });

      if (existingBookmark) {
        return NextResponse.json(
          { error: 'Content already bookmarked' },
          { status: 400 }
        );
      }

      const bookmark = await Bookmark.create({
        user: user.id,
        contentType,
        contentId,
        contentTitle,
        contentDescription: contentDescription || '',
        contentImage: contentImage || '',
        contentUrl: contentUrl || '',
        metadata: metadata || {},
      });

      return NextResponse.json({
        message: 'Bookmark created successfully',
        bookmark,
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
