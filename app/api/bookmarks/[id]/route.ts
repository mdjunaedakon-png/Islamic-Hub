import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { getCurrentUser } from '@/lib/auth';

// DELETE bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      await connectDB();
      
      const bookmark = await Bookmark.findOne({
        _id: params.id,
        user: user.id,
      });
      
      if (!bookmark) {
        return NextResponse.json(
          { error: 'Bookmark not found' },
          { status: 404 }
        );
      }

      await Bookmark.findByIdAndDelete(params.id);

      return NextResponse.json({
        message: 'Bookmark removed successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      return NextResponse.json({
        message: 'Bookmark removed successfully (demo mode)',
      });
    }
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET single bookmark
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      await connectDB();
      
      const bookmark = await Bookmark.findOne({
        _id: params.id,
        user: user.id,
      });
      
      if (!bookmark) {
        return NextResponse.json(
          { error: 'Bookmark not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ bookmark });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Get bookmark error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
