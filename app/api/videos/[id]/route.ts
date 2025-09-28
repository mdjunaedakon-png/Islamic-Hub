import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await connectDB();
      
      const video = await Video.findById(params.id)
        .populate('author', 'name email')
        .populate('comments.user', 'name email');

      if (video) {
        // Increment views
        video.views += 1;
        await video.save();

        // Format video data for frontend
        const formattedVideo = {
          ...video.toObject(),
          likes: video.likes ? video.likes.length : 0,
          dislikes: video.dislikes ? video.dislikes.length : 0,
          bookmarks: video.bookmarks ? video.bookmarks.length : 0,
        };

        return NextResponse.json({ video: formattedVideo });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json(
      { error: 'Video not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Get video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const video = await Video.findById(params.id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (video.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const { title, description, category } = await request.json();
    
    const updatedVideo = await Video.findByIdAndUpdate(
      params.id,
      { title, description, category },
      { new: true }
    ).populate('author', 'name email');

    return NextResponse.json({
      message: 'Video updated successfully',
      video: updatedVideo,
    });
  } catch (error) {
    console.error('Update video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const video = await Video.findById(params.id);
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    if (video.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
