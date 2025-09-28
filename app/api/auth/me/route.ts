import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      await connectDB();
      const userData = await User.findById(user.id).select('-password');
      
      if (!userData) {
        // If the token points to a user that doesn't exist in the new DB,
        // clear the cookie and ask the client to re-authenticate
        try {
          cookies().set('token', '', { expires: new Date(0), path: '/' });
        } catch {}
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        },
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
