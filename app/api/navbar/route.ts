import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarItem from '@/models/NavbarItem';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query: any = { isActive: true };
    if (type) {
      query.type = type;
    }
    
    const navbarItems = await NavbarItem.find(query)
      .sort({ order: 1, createdAt: 1 })
      .populate('parentId', 'title titleBengali');
    
    return NextResponse.json({ navbarItems });
  } catch (error) {
    console.error('Get navbar items error:', error);
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
    
    const { title, titleBengali, href, type, parentId, order, icon } = await request.json();

    if (!title || !titleBengali || !href || !type) {
      return NextResponse.json(
        { error: 'Title, Bengali title, href, and type are required' },
        { status: 400 }
      );
    }

    const navbarItem = await NavbarItem.create({
      title,
      titleBengali,
      href,
      type,
      parentId: parentId || null,
      order: order || 0,
      icon: icon || null,
    });

    await navbarItem.populate('parentId', 'title titleBengali');

    return NextResponse.json({
      message: 'Navbar item created successfully',
      navbarItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Create navbar item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
