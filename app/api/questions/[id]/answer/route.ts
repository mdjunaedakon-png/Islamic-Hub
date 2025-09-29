import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { answer } = await request.json();
    if (!answer || answer.trim().length < 3) {
      return NextResponse.json({ error: 'Answer is too short' }, { status: 400 });
    }

    await connectDB();

    const q = await Question.findById(params.id);
    if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    q.answer = answer.trim();
    q.answeredBy = (q as any).answeredBy || (user as any).id;
    q.status = 'answered';
    await q.save();

    await q.populate('user', 'name email');

    return NextResponse.json({ question: q });
  } catch (error) {
    console.error('Answer question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
