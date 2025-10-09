import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define the schema inline to avoid import issues
const NavbarItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  titleBengali: {
    type: String,
    required: [true, 'Bengali title is required'],
    trim: true,
  },
  href: {
    type: String,
    required: [true, 'Href is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['main', 'location', 'dropdown'],
    required: [true, 'Type is required'],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NavbarItem',
    default: null,
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const NavbarItem = mongoose.models.NavbarItem || mongoose.model('NavbarItem', NavbarItemSchema);

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Clear existing navbar items
    await NavbarItem.deleteMany({});
    
    // Create initial navbar items
    const navbarItems = [
      // Main navigation items
      {
        title: 'Home',
        titleBengali: 'প্রচ্ছদ',
        href: '/',
        type: 'main',
        order: 1,
        isActive: true,
      },
      {
        title: 'National',
        titleBengali: 'জাতীয়',
        href: '/news?category=local',
        type: 'main',
        order: 2,
        isActive: true,
      },
      {
        title: 'International',
        titleBengali: 'আন্তর্জাতিক',
        href: '/news?category=world',
        type: 'main',
        order: 3,
        isActive: true,
      },
      {
        title: 'Sports',
        titleBengali: 'খেলাধুলা',
        href: '/news?category=technology',
        type: 'main',
        order: 4,
        isActive: true,
      },
      {
        title: 'Technology',
        titleBengali: 'তথ্যপ্রযুক্তি',
        href: '/news?category=technology',
        type: 'main',
        order: 5,
        isActive: true,
      },
      {
        title: 'Entertainment',
        titleBengali: 'বিনোদন',
        href: '/news?category=education',
        type: 'main',
        order: 6,
        isActive: true,
      },
      {
        title: 'Others',
        titleBengali: 'অন্যান্য',
        href: '/news',
        type: 'main',
        order: 7,
        isActive: true,
      },
      
      // Location items
      {
        title: 'Dhaka',
        titleBengali: 'ঢাকা',
        href: '/news?location=dhaka',
        type: 'location',
        order: 1,
        isActive: true,
      },
      {
        title: 'Chittagong',
        titleBengali: 'চট্টগ্রাম',
        href: '/news?location=chittagong',
        type: 'location',
        order: 2,
        isActive: true,
      },
      {
        title: 'Rajshahi',
        titleBengali: 'রাজশাহী',
        href: '/news?location=rajshahi',
        type: 'location',
        order: 3,
        isActive: true,
      },
      {
        title: 'Sylhet',
        titleBengali: 'সিলেট',
        href: '/news?location=sylhet',
        type: 'location',
        order: 4,
        isActive: true,
      },
      {
        title: 'Mymensingh',
        titleBengali: 'ময়মনসিংহ',
        href: '/news?location=mymensingh',
        type: 'location',
        order: 5,
        isActive: true,
      },
      {
        title: 'Rangpur',
        titleBengali: 'রংপুর',
        href: '/news?location=rangpur',
        type: 'location',
        order: 6,
        isActive: true,
      },
      {
        title: 'Barisal',
        titleBengali: 'বরিশাল',
        href: '/news?location=barisal',
        type: 'location',
        order: 7,
        isActive: true,
      },
      
      // Dropdown items for National
      {
        title: 'Crime',
        titleBengali: 'অপরাধ',
        href: '/news?category=local&subcategory=crime',
        type: 'dropdown',
        parentId: null, // Will be set after main items are created
        order: 1,
        isActive: true,
      },
      {
        title: 'Law-Court',
        titleBengali: 'আইন-আদালত',
        href: '/news?category=local&subcategory=law',
        type: 'dropdown',
        parentId: null, // Will be set after main items are created
        order: 2,
        isActive: true,
      },
      {
        title: 'News',
        titleBengali: 'সংবাদি',
        href: '/news?category=local&subcategory=news',
        type: 'dropdown',
        parentId: null, // Will be set after main items are created
        order: 3,
        isActive: true,
      },
      {
        title: 'Special Report',
        titleBengali: 'বিশেষ প্রতিবেদন',
        href: '/news?category=local&subcategory=special',
        type: 'dropdown',
        parentId: null, // Will be set after main items are created
        order: 4,
        isActive: true,
      },
    ];

    // Create items one by one to handle parent references properly
    const createdItems = [];
    
    // First create main items
    for (const item of navbarItems.filter(item => item.type === 'main')) {
      const created = await NavbarItem.create(item);
      createdItems.push(created);
    }
    
    // Then create location items
    for (const item of navbarItems.filter(item => item.type === 'location')) {
      const created = await NavbarItem.create(item);
      createdItems.push(created);
    }
    
    // Find the National item to use as parent for dropdown items
    const nationalItem = createdItems.find(item => item.titleBengali === 'জাতীয়');
    
    // Finally create dropdown items with proper parent reference
    if (nationalItem) {
      for (const item of navbarItems.filter(item => item.type === 'dropdown')) {
        await NavbarItem.create({
          ...item,
          parentId: nationalItem._id,
        });
      }
    }

    return NextResponse.json({
      message: 'Navbar items seeded successfully',
      count: navbarItems.length,
    });
  } catch (error) {
    console.error('Seed navbar items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
