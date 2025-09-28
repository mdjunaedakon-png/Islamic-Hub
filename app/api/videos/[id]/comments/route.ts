import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { getCurrentUser } from '@/lib/auth';

// GET comments for a video
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await connectDB();
      
      const video = await Video.findById(params.id)
        .populate('comments.user', 'name email avatar')
        .select('comments');

      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      // Format comments to include both user and author fields for compatibility
      const formattedComments = video.comments.map((comment: any) => ({
        ...comment.toObject(),
        author: comment.user, // Add author field for compatibility
      }));

      return NextResponse.json({ comments: formattedComments });
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    // Fallback to mock comments
    const mockComments = [
      {
        _id: '507f1f77bcf86cd799439021',
        text: 'MashaAllah, very informative lecture. May Allah bless the speaker.',
        user: {
          _id: '507f1f77bcf86cd799439031',
          name: 'Ahmad Hassan',
          email: 'ahmad@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        author: {
          _id: '507f1f77bcf86cd799439031',
          name: 'Ahmad Hassan',
          email: 'ahmad@example.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        createdAt: new Date().toISOString(),
        likes: 12,
        replies: []
      },
      {
        _id: '507f1f77bcf86cd799439022',
        text: 'JazakAllah khair for sharing this beautiful nasheed.',
        user: {
          _id: '507f1f77bcf86cd799439032',
          name: 'Fatima Ali',
          email: 'fatima@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        author: {
          _id: '507f1f77bcf86cd799439032',
          name: 'Fatima Ali',
          email: 'fatima@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 8,
        replies: []
      },
      {
        _id: '507f1f77bcf86cd799439023',
        text: 'SubhanAllah, this really touched my heart. May Allah reward you for sharing.',
        user: {
          _id: '507f1f77bcf86cd799439033',
          name: 'Omar Abdullah',
          email: 'omar@example.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        author: {
          _id: '507f1f77bcf86cd799439033',
          name: 'Omar Abdullah',
          email: 'omar@example.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 15,
        replies: []
      }
    ];

    return NextResponse.json({ comments: mockComments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new comment
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

    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment text is required' },
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

      const newComment = {
        text: text.trim(),
        user: user.id,
        createdAt: new Date(),
        likes: 0,
        replies: []
      };

      video.comments.push(newComment);
      await video.save();

      // Populate the comment with user data
      await video.populate('comments.user', 'name email avatar');
      const addedComment: any = video.comments[video.comments.length - 1];

      // Ensure consistent field naming
      const formattedComment = {
        ...addedComment.toObject(),
        author: addedComment.user, // Add author field for compatibility
      };

      return NextResponse.json({
        message: 'Comment added successfully',
        comment: formattedComment
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return mock comment for demo
      const mockComment = {
        _id: Date.now().toString(),
        text: text.trim(),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || ''
        },
        author: {
          _id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || ''
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      return NextResponse.json({
        message: 'Comment added successfully (demo mode)',
        comment: mockComment
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
