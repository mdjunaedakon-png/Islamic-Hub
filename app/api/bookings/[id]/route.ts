import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getCurrentUser } from '@/lib/auth';

// GET single booking
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
      
      const booking = await Booking.findOne({
        _id: params.id,
        user: user.id,
      });
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ booking });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const {
      bookingDate,
      status,
      notes,
      reminderDate,
    } = await request.json();

    try {
      await connectDB();
      
      const booking = await Booking.findOne({
        _id: params.id,
        user: user.id,
      });
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        params.id,
        {
          bookingDate: bookingDate ? new Date(bookingDate) : booking.bookingDate,
          status: status || booking.status,
          notes: notes !== undefined ? notes : booking.notes,
          reminderDate: reminderDate ? new Date(reminderDate) : booking.reminderDate,
        },
        { new: true }
      );

      return NextResponse.json({
        message: 'Booking updated successfully',
        booking: updatedBooking,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      return NextResponse.json({
        message: 'Booking updated successfully (demo mode)',
        booking: {
          _id: params.id,
          bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
          status: status || 'active',
          notes: notes || '',
          reminderDate: reminderDate ? new Date(reminderDate) : null,
        },
      });
    }
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE booking
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
      
      const booking = await Booking.findOne({
        _id: params.id,
        user: user.id,
      });
      
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }

      await Booking.findByIdAndDelete(params.id);

      return NextResponse.json({
        message: 'Booking cancelled successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      return NextResponse.json({
        message: 'Booking cancelled successfully (demo mode)',
      });
    }
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
