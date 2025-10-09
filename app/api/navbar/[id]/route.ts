import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavbarItem from '@/models/NavbarItem';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const navbarItem = await NavbarItem.findById(params.id)
      .populate('parentId', 'title titleBengali');
    
    if (!navbarItem) {
      return NextResponse.json(
        { error: 'Navbar item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ navbarItem });
  } catch (error) {
    console.error('Get navbar item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const { title, titleBengali, href, type, parentId, order, isActive, icon } = await request.json();

    const navbarItem = await NavbarItem.findByIdAndUpdate(
      params.id,
      {
        title,
        titleBengali,
        href,
        type,
        parentId: parentId || null,
        order,
        isActive,
        icon,
      },
      { new: true }
    ).populate('parentId', 'title titleBengali');

    if (!navbarItem) {
      return NextResponse.json(
        { error: 'Navbar item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Navbar item updated successfully',
      navbarItem,
    });
  } catch (error) {
    console.error('Update navbar item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await connectDB();
    
    const navbarItem = await NavbarItem.findByIdAndDelete(params.id);

    if (!navbarItem) {
      return NextResponse.json(
        { error: 'Navbar item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Navbar item deleted successfully',
    });
  } catch (error) {
    console.error('Delete navbar item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
