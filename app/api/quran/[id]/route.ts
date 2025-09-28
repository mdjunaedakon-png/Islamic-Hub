import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quran from '@/models/Quran';
import { getCurrentUser } from '@/lib/auth';

// GET single surah
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await connectDB();
      
      const surah = await Quran.findById(params.id);

      if (surah) {
        return NextResponse.json({ surah });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json(
      { error: 'Surah not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Get surah error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update surah (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const {
      surahName,
      surahNameArabic,
      surahNameEnglish,
      ayahs,
      totalAyahs,
      revelationPlace,
    } = await request.json();

    try {
      await connectDB();
      
      const surah = await Quran.findById(params.id);
      
      if (!surah) {
        return NextResponse.json(
          { error: 'Surah not found' },
          { status: 404 }
        );
      }

      const updatedSurah = await Quran.findByIdAndUpdate(
        params.id,
        {
          surahName,
          surahNameArabic,
          surahNameEnglish,
          ayahs,
          totalAyahs,
          revelationPlace,
        },
        { new: true }
      );

      return NextResponse.json({
        message: 'Surah updated successfully',
        surah: updatedSurah,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Update surah error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE surah (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    try {
      await connectDB();
      
      const surah = await Quran.findById(params.id);
      
      if (!surah) {
        return NextResponse.json(
          { error: 'Surah not found' },
          { status: 404 }
        );
      }

      await Quran.findByIdAndDelete(params.id);

      return NextResponse.json({
        message: 'Surah deleted successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete surah error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
