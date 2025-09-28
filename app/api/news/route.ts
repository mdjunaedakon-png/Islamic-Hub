import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import { getCurrentUser } from '@/lib/auth';
import { mockNews } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    try {
      await connectDB();
      
      const query: any = { published: true };
      
      if (category) {
        query.category = category;
      }
      
      if (featured === 'true') {
        query.featured = true;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const news = await News.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await News.countDocuments(query);

      return NextResponse.json({
        news,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      console.log('🔄 Using mock data for demo purposes');
      
      // Filter mock data based on search and category
      let filteredNews = mockNews;
      
      if (category) {
        filteredNews = filteredNews.filter(article => article.category === category);
      }
      
      if (featured === 'true') {
        filteredNews = filteredNews.filter(article => article.featured);
      }
      
      if (search) {
        filteredNews = filteredNews.filter(article => 
          article.title.toLowerCase().includes(search.toLowerCase()) ||
          article.content.toLowerCase().includes(search.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNews = filteredNews.slice(startIndex, endIndex);
      
      return NextResponse.json({
        news: paginatedNews,
        pagination: {
          page,
          limit,
          total: filteredNews.length,
          pages: Math.ceil(filteredNews.length / limit),
        },
      });
    }
  } catch (error) {
    console.error('Get news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { title, content, excerpt, image, category, featured, tags } = await request.json();

    if (!title || !content || !excerpt || !image || !category) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const news = await News.create({
      title,
      content,
      excerpt,
      image,
      category,
      featured: featured || false,
      tags: tags || [],
      author: user.id,
      published: true,
    });

    await news.populate('author', 'name email');

    return NextResponse.json({
      message: 'News created successfully',
      news,
    }, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
