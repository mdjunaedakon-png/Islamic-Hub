import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { getCurrentUser } from '@/lib/auth';

// Handle video interactions (like, dislike, bookmark)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (!['like', 'dislike', 'bookmark'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      
      const video = await Video.findById(params.id);
      
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      let message = '';
      let updated = false;

      // Ensure arrays exist and are properly initialized
      if (!Array.isArray(video.likes)) {
        video.likes = [];
      }
      if (!Array.isArray(video.dislikes)) {
        video.dislikes = [];
      }
      if (!Array.isArray(video.bookmarks)) {
        video.bookmarks = [];
      }

      switch (action) {
        case 'like':
          if (video.likes.includes(user.id)) {
            video.likes = video.likes.filter((id: any) => id.toString() !== user.id);
            message = 'Like removed';
          } else {
            video.likes.push(user.id);
            video.dislikes = video.dislikes.filter((id: any) => id.toString() !== user.id);
            message = 'Video liked';
            updated = true;
          }
          break;
        
        case 'dislike':
          if (video.dislikes.includes(user.id)) {
            video.dislikes = video.dislikes.filter((id: any) => id.toString() !== user.id);
            message = 'Dislike removed';
          } else {
            video.dislikes.push(user.id);
            video.likes = video.likes.filter((id: any) => id.toString() !== user.id);
            message = 'Video disliked';
            updated = true;
          }
          break;
        
        case 'bookmark':
          if (video.bookmarks.includes(user.id)) {
            video.bookmarks = video.bookmarks.filter((id: any) => id.toString() !== user.id);
            message = 'Bookmark removed';
          } else {
            video.bookmarks.push(user.id);
            message = 'Video bookmarked';
            updated = true;
          }
          break;
      }

      await video.save();

      return NextResponse.json({
        message,
        updated,
        likes: video.likes.length,
        dislikes: video.dislikes.length,
        bookmarks: video.bookmarks.length,
        userLiked: video.likes.includes(user.id),
        userDisliked: video.dislikes.includes(user.id),
        userBookmarked: video.bookmarks.includes(user.id)
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video interaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET user's interaction status for a video
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        userLiked: false,
        userDisliked: false,
        userBookmarked: false
      });
    }

    try {
      await connectDB();
      
      const video = await Video.findById(params.id);
      
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      // Ensure arrays exist and are properly initialized
      const likes = Array.isArray(video.likes) ? video.likes : [];
      const dislikes = Array.isArray(video.dislikes) ? video.dislikes : [];
      const bookmarks = Array.isArray(video.bookmarks) ? video.bookmarks : [];

      return NextResponse.json({
        userLiked: likes.includes(user.id),
        userDisliked: dislikes.includes(user.id),
        userBookmarked: bookmarks.includes(user.id),
        likes: likes.length,
        dislikes: dislikes.length,
        bookmarks: bookmarks.length
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get video interactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
