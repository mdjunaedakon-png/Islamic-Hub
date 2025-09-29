import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

// List questions (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    await connectDB();

    const query: any = {};
    if (status) query.status = status;

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email')
      .populate('answeredBy', 'name email');

    const total = await Question.countDocuments(query);

    return NextResponse.json({
      questions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create question (logged-in)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { text } = await request.json();
    if (!text || text.trim().length < 5) {
      return NextResponse.json({ error: 'Question is too short' }, { status: 400 });
    }

    await connectDB();

    const q = await Question.create({ user: user.id, text: text.trim() });
    await q.populate('user', 'name email');

    return NextResponse.json({ question: q }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
