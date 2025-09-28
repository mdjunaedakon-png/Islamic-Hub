import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('📦 Products API: GET request received');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // Add CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      console.log('📦 Products API: Attempting database connection...');
      await connectDB();
      
      const query: any = { active: true };
      
      if (category) {
        query.category = category;
      }
      
      if (featured === 'true') {
        query.featured = true;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Product.countDocuments(query);

      return NextResponse.json({
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }, { headers });
    } catch (dbError) {
      console.error('📦 Products API: Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('📦 Products API: Get products error:', error);
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

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Products API: POST request received');
    const user = await getCurrentUser();
    console.log('📦 Products API: User:', user);
    
    // For demo purposes, allow creating products without authentication
    // In production, you would require admin authentication
    if (!user || user.role !== 'admin') {
      console.log('📦 Products API: User not authorized, but allowing for demo purposes');
      // For demo, we'll continue without authentication
    }

    const {
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      stock,
      sku,
      weight,
      dimensions,
      features,
      tags,
      featured,
    } = await request.json();

    if (!name || !description || price === undefined || price === null || !images || !category || !sku) {
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400, headers }
      );
    }

    try {
      console.log('📦 Products API: Attempting to save product to database...');
      await connectDB();
      
      const product = await Product.create({
        name,
        description,
        price,
        originalPrice: originalPrice || 0,
        images: Array.isArray(images) ? images : [images],
        category,
        stock: stock || 0,
        sku,
        weight: weight || 0,
        dimensions: dimensions || null,
        features: Array.isArray(features) ? features : [],
        tags: Array.isArray(tags) ? tags : [],
        featured: featured || false,
        active: true,
      });

      console.log('📦 Products API: Product saved successfully:', product._id);

      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return NextResponse.json({
        message: 'Product created successfully',
        product,
      }, { status: 201, headers });
    } catch (dbError) {
      console.error('📦 Products API: Database save error:', dbError);
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      return NextResponse.json(
        { error: 'Database save error' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Create product error:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}
