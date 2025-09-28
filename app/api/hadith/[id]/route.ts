import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hadith from '@/models/Hadith';
import { getCurrentUser } from '@/lib/auth';

// GET single hadith
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    try {
      await connectDB();
      
      const hadith = await Hadith.findById(params.id);

      if (hadith) {
        return NextResponse.json({ hadith });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json(
      { error: 'Hadith not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Get hadith error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update hadith (Admin only)
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
      collectionName,
      hadithNumber,
      arabicText,
      englishTranslation,
      banglaTranslation,
      narrator,
      chapter,
      book,
      volume,
      page,
      tags,
    } = await request.json();

    try {
      await connectDB();
      
      const hadith = await Hadith.findById(params.id);
      
      if (!hadith) {
        return NextResponse.json(
          { error: 'Hadith not found' },
          { status: 404 }
        );
      }

      const updatedHadith = await Hadith.findByIdAndUpdate(
        params.id,
        {
          collectionName,
          hadithNumber,
          arabicText,
          englishTranslation,
          banglaTranslation,
          narrator,
          chapter,
          book,
          volume: volume || '',
          page: page || '',
          tags: Array.isArray(tags) ? tags : [],
        },
        { new: true }
      );

      return NextResponse.json({
        message: 'Hadith updated successfully',
        hadith: updatedHadith,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Update hadith error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE hadith (Admin only)
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
      
      const hadith = await Hadith.findById(params.id);
      
      if (!hadith) {
        return NextResponse.json(
          { error: 'Hadith not found' },
          { status: 404 }
        );
      }

      await Hadith.findByIdAndDelete(params.id);

      return NextResponse.json({
        message: 'Hadith deleted successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete hadith error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
