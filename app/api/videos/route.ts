import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { getCurrentUser } from '@/lib/auth';
import { mockVideos } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    try {
      await connectDB();
      
      const query: any = {};
      
      if (category) {
        query.category = category;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const videos = await Video.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Video.countDocuments(query);

      // Format videos data for frontend
      const formattedVideos = videos.map(video => ({
        ...video.toObject(),
        likes: video.likes ? video.likes.length : 0,
        dislikes: video.dislikes ? video.dislikes.length : 0,
        bookmarks: video.bookmarks ? video.bookmarks.length : 0,
      }));

      return NextResponse.json({
        videos: formattedVideos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      console.log('🔄 Using mock data for demo purposes');
      
      // Filter mock data based on search and category
      let filteredVideos = mockVideos;
      
      if (category) {
        filteredVideos = filteredVideos.filter(video => video.category === category);
      }
      
      if (search) {
        filteredVideos = filteredVideos.filter(video => 
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex);
      
      return NextResponse.json({
        videos: paginatedVideos,
        pagination: {
          page,
          limit,
          total: filteredVideos.length,
          pages: Math.ceil(filteredVideos.length / limit),
        },
      });
    }
  } catch (error) {
    console.error('Get videos error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { title, description, videoUrl, thumbnail, category, duration } = await request.json();

    if (!title || !description || !videoUrl || !thumbnail || !category || !duration) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnail,
      category,
      duration,
      author: user.id,
    });

    await video.populate('author', 'name email');

    return NextResponse.json({
      message: 'Video created successfully',
      video,
    }, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
