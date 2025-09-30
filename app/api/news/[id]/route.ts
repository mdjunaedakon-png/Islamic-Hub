import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📰 News API: GET request for news ID:', params.id);
    
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      await connectDB();
      
      const news = await News.findById(params.id);
      
      if (!news) {
        return NextResponse.json(
          { error: 'News article not found' },
          { status: 404, headers }
        );
      }

      // Increment view count
      await News.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

      return NextResponse.json({
        news: {
          _id: news._id,
          title: news.title,
          content: news.content,
          excerpt: news.excerpt,
          image: news.image,
          category: news.category,
          featured: news.featured,
          views: news.views + 1,
          tags: news.tags,
          author: news.author,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
        },
      }, { headers });
    } catch (dbError) {
      console.error('📰 News API: Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('📰 News API: Get news error:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (user.role !== 'admin') return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { title, excerpt, content, image, category, featured } = await request.json();

    await connectDB();
    const news = await News.findById(params.id);
    if (!news) return NextResponse.json({ error: 'News article not found' }, { status: 404, headers });

    news.title = title ?? news.title;
    news.excerpt = excerpt ?? news.excerpt;
    news.content = content ?? news.content;
    news.image = image ?? news.image;
    news.category = category ?? news.category;
    news.featured = featured ?? news.featured;
    await news.save();

    return NextResponse.json({ message: 'News updated successfully', news }, { headers });
  } catch (error) {
    console.error('📰 News API: Update news error:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📰 News API: DELETE request for news ID:', params.id);
    
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      await connectDB();
      
      const news = await News.findById(params.id);
      
      if (!news) {
        return NextResponse.json(
          { error: 'News article not found' },
          { status: 404, headers }
        );
      }

      await News.findByIdAndDelete(params.id);

      return NextResponse.json({
        message: 'News article deleted successfully',
      }, { headers });
    } catch (dbError) {
      console.error('📰 News API: Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('📰 News API: Delete news error:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new NextResponse(null, { status: 200, headers });
}
