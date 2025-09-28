import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quran from '@/models/Quran';
import { getCurrentUser } from '@/lib/auth';

// GET all surahs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const revelationPlace = searchParams.get('revelationPlace');
    const surahNumber = searchParams.get('surah');

    try {
      await connectDB();

      const query: any = {};

      // If surah number is specified, return that specific surah
      if (surahNumber) {
        const surah = await Quran.findOne({ surahNumber: parseInt(surahNumber) });
        if (surah) {
          return NextResponse.json({ surah });
        } else {
          return NextResponse.json(
            { error: 'Surah not found' },
            { status: 404 }
          );
        }
      }

      if (revelationPlace) {
        query.revelationPlace = revelationPlace;
      }

      if (search) {
        query.$or = [
          { surahName: { $regex: search, $options: 'i' } },
          { surahNameArabic: { $regex: search, $options: 'i' } },
          { surahNameEnglish: { $regex: search, $options: 'i' } },
          { 'ayahs.arabicText': { $regex: search, $options: 'i' } },
          { 'ayahs.englishTranslation': { $regex: search, $options: 'i' } },
          { 'ayahs.banglaTranslation': { $regex: search, $options: 'i' } },
        ];
      }

      const surahs = await Quran.find(query)
        .sort({ surahNumber: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Quran.countDocuments(query);

      return NextResponse.json({
        surahs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
    console.error('Get surahs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new surah (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const {
      surahNumber,
      surahName,
      surahNameArabic,
      surahNameEnglish,
      ayahs,
      totalAyahs,
      revelationPlace,
    } = await request.json();

    if (!surahNumber || !surahName || !surahNameArabic || !surahNameEnglish || !ayahs || !totalAyahs || !revelationPlace) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (!Array.isArray(ayahs) || ayahs.length === 0) {
      return NextResponse.json(
        { error: 'At least one ayah is required' },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      // Check if surah already exists
      const existingSurah = await Quran.findOne({ surahNumber });

      if (existingSurah) {
        return NextResponse.json(
          { error: 'Surah with this number already exists' },
          { status: 400 }
        );
      }

      const surah = await Quran.create({
        surahNumber,
        surahName,
        surahNameArabic,
        surahNameEnglish,
        ayahs,
        totalAyahs,
        revelationPlace,
      });

      return NextResponse.json({
        message: 'Surah created successfully',
        surah,
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { error: 'Database save error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create surah error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}