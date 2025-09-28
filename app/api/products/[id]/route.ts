import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { mockProducts } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📦 Products API: GET request for product ID:', params.id);
    
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    try {
      await connectDB();
      
      const product = await Product.findById(params.id);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json({
        product: {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          category: product.category,
          stock: product.stock,
          sku: product.sku,
          weight: product.weight,
          dimensions: product.dimensions,
          features: product.features,
          tags: product.tags,
          featured: product.featured,
          active: product.active,
          createdAt: product.createdAt,
        },
      }, { headers });
    } catch (dbError) {
      console.error('📦 Products API: Database connection error:', dbError);
      console.log('🔄 Products API: Using mock data for demo purposes');
      
      // Find mock product by ID
      const mockProduct = mockProducts.find(product => product._id === params.id);
      
      if (!mockProduct) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json({
        product: mockProduct,
      }, { headers });
    }
  } catch (error) {
    console.error('📦 Products API: Get product error:', error);
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
