import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import { mockNews } from '@/lib/mockData';

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
      console.log('🔄 News API: Using mock data for demo purposes');
      
      // Find mock news by ID
      const mockArticle = mockNews.find(article => article._id === params.id);
      
      if (!mockArticle) {
        return NextResponse.json(
          { error: 'News article not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json({
        news: mockArticle,
      }, { headers });
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

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new NextResponse(null, { status: 200, headers });
}
