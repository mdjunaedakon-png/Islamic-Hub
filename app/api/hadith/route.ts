import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Hadith from '@/models/Hadith';
import { getCurrentUser } from '@/lib/auth';

// GET all hadiths
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const collection = searchParams.get('collection');
    const search = searchParams.get('search');
    const chapter = searchParams.get('chapter');

    try {
      await connectDB();

      const query: any = {};

      if (collection) {
        query.collectionName = collection;
      }

      if (chapter) {
        query.chapter = { $regex: chapter, $options: 'i' };
      }

      if (search) {
        query.$or = [
          { arabicText: { $regex: search, $options: 'i' } },
          { englishTranslation: { $regex: search, $options: 'i' } },
          { banglaTranslation: { $regex: search, $options: 'i' } },
          { narrator: { $regex: search, $options: 'i' } },
          { chapter: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const hadiths = await Hadith.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Hadith.countDocuments(query);

      return NextResponse.json({
        hadiths,
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
    console.error('Get hadiths error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new hadith (Admin only)
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

    if (!collectionName || !hadithNumber || !arabicText || !englishTranslation || !banglaTranslation || !narrator || !chapter || !book) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    try {
      await connectDB();

      // Check if hadith already exists
      const existingHadith = await Hadith.findOne({
        collectionName,
        hadithNumber,
      });

      if (existingHadith) {
        return NextResponse.json(
          { error: 'Hadith with this number already exists in this collection' },
          { status: 400 }
        );
      }

      const hadith = await Hadith.create({
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
      });

      return NextResponse.json({
        message: 'Hadith created successfully',
        hadith,
      }, { status: 201 });
    } catch (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { error: 'Database save error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Create hadith error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}