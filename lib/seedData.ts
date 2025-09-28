import connectDB from './mongodb';
import User from '@/models/User';
import Video from '@/models/Video';
import News from '@/models/News';
import Product from '@/models/Product';
import Quran from '@/models/Quran';
import Hadith from '@/models/Hadith';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Video.deleteMany({});
    await News.deleteMany({});
    await Product.deleteMany({});
    await Quran.deleteMany({});
    await Hadith.deleteMany({});

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@islamichub.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create regular user
    const userPassword = await hashPassword('user123');
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    });

    // Create sample videos
    const videos = [
      {
        title: 'Understanding the Five Pillars of Islam',
        description: 'A comprehensive lecture explaining the fundamental principles of Islam and their importance in a Muslim\'s life.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
        category: 'lecture',
        duration: 3600,
        author: adminUser._id,
      },
      {
        title: 'Beautiful Nasheed - Allahu Akbar',
        description: 'A soulful nasheed praising Allah and expressing gratitude for His blessings.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=250&fit=crop',
        category: 'nasheed',
        duration: 240,
        author: adminUser._id,
      },
      {
        title: 'Dawah to Non-Muslims - How to Share Islam',
        description: 'Learn effective ways to share the beautiful message of Islam with others.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop',
        category: 'dawah',
        duration: 1800,
        author: adminUser._id,
      },
    ];

    for (const video of videos) {
      await Video.create(video);
    }

    // Create sample news
    const news = [
      {
        title: 'New Islamic Center Opens in Downtown',
        content: 'A new Islamic center has opened in the heart of downtown, providing a place for the Muslim community to gather, pray, and learn. The center features a beautiful prayer hall, library, and educational facilities.',
        excerpt: 'A new Islamic center opens downtown with modern facilities for the Muslim community.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop',
        category: 'islamic',
        author: adminUser._id,
        published: true,
        featured: true,
        tags: ['islamic center', 'community', 'downtown'],
      },
      {
        title: 'Islamic Conference 2024: Unity in Diversity',
        content: 'The annual Islamic conference brought together scholars, community leaders, and believers from around the world to discuss important topics including interfaith dialogue, social justice, and spiritual growth.',
        excerpt: 'Annual Islamic conference promotes unity and interfaith dialogue among diverse communities.',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
        category: 'islamic',
        author: adminUser._id,
        published: true,
        featured: false,
        tags: ['conference', 'unity', 'interfaith'],
      },
      {
        title: 'Technology and Islamic Education: A Modern Approach',
        content: 'How modern technology is being used to make Islamic education more accessible and engaging for students of all ages. From online Quran classes to interactive learning apps.',
        excerpt: 'Modern technology revolutionizes Islamic education with online classes and interactive learning.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
        category: 'education',
        author: adminUser._id,
        published: true,
        featured: false,
        tags: ['technology', 'education', 'online learning'],
      },
    ];

    for (const article of news) {
      await News.create(article);
    }

    // Create sample products
    const products = [
      {
        name: 'Holy Quran - Arabic with English Translation',
        description: 'A beautiful hardcover edition of the Holy Quran with clear Arabic text and comprehensive English translation. Perfect for study and reflection.',
        price: 29.99,
        originalPrice: 39.99,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'],
        category: 'books',
        stock: 50,
        sku: 'QURAN-001',
        features: ['Arabic text', 'English translation', 'Hardcover', 'High quality paper'],
        tags: ['quran', 'holy book', 'translation', 'arabic'],
        featured: true,
      },
      {
        name: 'Premium Prayer Mat - Handwoven',
        description: 'A beautiful handwoven prayer mat made from high-quality materials. Features intricate Islamic patterns and comfortable padding.',
        price: 49.99,
        images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop'],
        category: 'prayer_mats',
        stock: 25,
        sku: 'PRAYER-001',
        features: ['Handwoven', 'Premium materials', 'Islamic patterns', 'Comfortable padding'],
        tags: ['prayer mat', 'handwoven', 'premium', 'islamic patterns'],
        featured: true,
      },
      {
        name: 'Tasbih - 99 Beads with Case',
        description: 'A traditional 99-bead tasbih made from high-quality materials. Comes with a beautiful carrying case for protection.',
        price: 19.99,
        images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop'],
        category: 'tasbih',
        stock: 100,
        sku: 'TASBIH-001',
        features: ['99 beads', 'High quality materials', 'Carrying case', 'Traditional design'],
        tags: ['tasbih', 'dhikr', '99 beads', 'traditional'],
        featured: false,
      },
    ];

    for (const product of products) {
      await Product.create(product);
    }

    // Create sample Quran data (Al-Fatiha)
    const alFatiha = await Quran.create({
      surahNumber: 1,
      surahName: 'Al-Fatiha',
      surahNameArabic: 'الفاتحة',
      surahNameEnglish: 'The Opening',
      totalAyahs: 7,
      revelationPlace: 'makkah',
      ayahs: [
        {
          ayahNumber: 1,
          arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          banglaTranslation: 'পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে।',
          audioUrl: 'https://www.example.com/audio/fatiha-1.mp3',
        },
        {
          ayahNumber: 2,
          arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          englishTranslation: '[All] praise is [due] to Allah, Lord of the worlds.',
          banglaTranslation: 'সকল প্রশংসা আল্লাহর জন্য, যিনি বিশ্বজগতের প্রতিপালক।',
          audioUrl: 'https://www.example.com/audio/fatiha-2.mp3',
        },
        {
          ayahNumber: 3,
          arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
          englishTranslation: 'The Entirely Merciful, the Especially Merciful,',
          banglaTranslation: 'পরম করুণাময়, অসীম দয়ালু,',
          audioUrl: 'https://www.example.com/audio/fatiha-3.mp3',
        },
        {
          ayahNumber: 4,
          arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
          englishTranslation: 'Sovereign of the Day of Recompense.',
          banglaTranslation: 'বিচার দিবসের মালিক।',
          audioUrl: 'https://www.example.com/audio/fatiha-4.mp3',
        },
        {
          ayahNumber: 5,
          arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
          englishTranslation: 'It is You we worship and You we ask for help.',
          banglaTranslation: 'আমরা একমাত্র তোমারই ইবাদত করি এবং একমাত্র তোমারই কাছে সাহায্য প্রার্থনা করি।',
          audioUrl: 'https://www.example.com/audio/fatiha-5.mp3',
        },
        {
          ayahNumber: 6,
          arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
          englishTranslation: 'Guide us to the straight path -',
          banglaTranslation: 'আমাদেরকে সরল পথ দেখাও -',
          audioUrl: 'https://www.example.com/audio/fatiha-6.mp3',
        },
        {
          ayahNumber: 7,
          arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
          englishTranslation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
          banglaTranslation: 'যাদের প্রতি তুমি অনুগ্রহ করেছ তাদের পথ, যাদের প্রতি তুমি রাগান্বিত নও এবং যারা পথভ্রষ্ট।',
          audioUrl: 'https://www.example.com/audio/fatiha-7.mp3',
        },
      ],
    });

    // Create sample Hadith data
    const hadiths = [
      {
        collectionName: 'bukhari',
        hadithNumber: '1',
        arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        englishTranslation: 'Actions are according to intentions, and every person will have what they intended.',
        banglaTranslation: 'নিশ্চয়ই সকল কাজের ফলাফল নির্ভর করে নিয়তের উপর, এবং প্রত্যেক ব্যক্তিই তার নিয়ত অনুযায়ী ফল পাবে।',
        narrator: 'Umar ibn al-Khattab',
        chapter: 'How Revelation Started',
        book: 'Sahih al-Bukhari',
        volume: '1',
        page: '1',
        tags: ['intention', 'actions', 'niyyah'],
      },
      {
        collectionName: 'muslim',
        hadithNumber: '1',
        arabicText: 'مَنْ حَسَّنَ إِسْلاَمَهُ فَهُوَ الَّذِي أَسْلَمَ قَبْلَهُ',
        englishTranslation: 'Whoever improves his Islam, then he is the one who embraced Islam before him.',
        banglaTranslation: 'যে ব্যক্তি তার ইসলামকে সুন্দর করে, সে-ই তার পূর্ববর্তী ইসলাম গ্রহণকারী।',
        narrator: 'Abu Huraira',
        chapter: 'Faith',
        book: 'Sahih Muslim',
        volume: '1',
        page: '1',
        tags: ['islam', 'improvement', 'faith'],
      },
    ];

    for (const hadith of hadiths) {
      await Hadith.create(hadith);
    }

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin user created: admin@islamichub.com / admin123');
    console.log('👤 Regular user created: user@example.com / user123');
    console.log('📹 Sample videos created');
    console.log('📰 Sample news created');
    console.log('🛍️ Sample products created');
    console.log('📖 Sample Quran data created');
    console.log('💬 Sample Hadith data created');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  });
}
