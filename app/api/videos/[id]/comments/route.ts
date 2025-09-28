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
    
    return NextResponse.json(
      { error: 'Video not found' },
      { status: 404 }
    );
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
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
