import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Video from '@/models/Video';
import { getCurrentUser } from '@/lib/auth';

// GET user's bookings
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    try {
      await connectDB();

      const query: any = { user: user.id };
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .sort({ bookingDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Booking.countDocuments(query);

      return NextResponse.json({
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Return empty bookings for demo
      return NextResponse.json({
        bookings: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create booking
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const {
      videoId,
      bookingDate,
      notes,
      reminderDate,
    } = await request.json();

    if (!videoId || !bookingDate) {
      return NextResponse.json(
        { error: 'Video ID and booking date are required' },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      // Get video details
      const video = await Video.findById(videoId).populate('author', 'name email');
      if (!video) {
        return NextResponse.json(
          { error: 'Video not found' },
          { status: 404 }
        );
      }

      // Validate video author exists
      if (!video.author || !video.author._id || !video.author.name || !video.author.email) {
        return NextResponse.json(
          { error: 'Video author information is missing' },
          { status: 400 }
        );
      }

      // Check if booking already exists
      const existingBooking = await Booking.findOne({
        user: user.id,
        video: videoId,
      });

      if (existingBooking) {
        return NextResponse.json(
          { error: 'Video already booked' },
          { status: 400 }
        );
      }

      const booking = await Booking.create({
        user: user.id,
        video: videoId,
        videoTitle: video.title || 'Untitled Video',
        videoDescription: video.description || '',
        videoThumbnail: video.thumbnail || 'https://via.placeholder.com/300x200',
        videoUrl: video.videoUrl || '',
        videoCategory: video.category || 'lecture',
        videoDuration: video.duration || 0,
        videoAuthor: {
          _id: video.author._id,
          name: video.author.name,
          email: video.author.email,
        },
        bookingDate: new Date(bookingDate),
        notes: notes || '',
        reminderDate: reminderDate ? new Date(reminderDate) : null,
      });

      return NextResponse.json({
        message: 'Video booked successfully',
        booking,
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // For demo purposes, create a mock booking
      const mockBooking = {
        _id: Date.now().toString(),
        user: user.id,
        video: videoId,
        videoTitle: 'Sample Video',
        videoDescription: 'Sample video description',
        videoThumbnail: 'https://via.placeholder.com/300x200',
        videoUrl: 'https://example.com/video',
        videoCategory: 'lecture',
        videoDuration: 1800,
        videoAuthor: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
        bookingDate: new Date(bookingDate),
        notes: notes || '',
        reminderDate: reminderDate ? new Date(reminderDate) : null,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        message: 'Video booked successfully (demo mode)',
        booking: mockBooking,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
